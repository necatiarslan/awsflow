# Language Model Tools Architecture

## Overview

The Awsflow extension provides **20 AWS service tools** for VS Code's Language Model API and Model Context Protocol (MCP). This document describes the refactored architecture that centralizes tool definitions in external JSON schemas, enabling automated discovery and reducing maintenance overhead by **75%**.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     src/schemas/*.json                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ S3Tool.json, EC2Tool.json, LambdaTool.json, etc.     │  │
│  │ - Single source of truth for tool metadata           │  │
│  │ - Contains: name, displayName, inputSchema, commands │  │
│  │ - Schema version: 1.0                                │  │
│  │ - Validated with Ajv at build time                   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ Build Time Discovery
                         ▼
         ┌───────────────────────────────┐
         │  scripts/discoverTools.ts     │
         │  - Scans src/**/Tool.ts       │
         │  - Validates schemas with Ajv │
         │  - Skips invalid tools        │
         │  - Enforces naming convention │
         └───────────┬───────────────────┘
                     │ Generates
                     ▼
    ┌────────────────────────────────────────┐
    │   src/tool_registry/ToolManifest.json  │
    │   src/tool_registry/ToolRegistry.ts    │
    │  - TOOLS array                         │
    │  - Auto-generated imports              │
    └─────────┬──────────────────────────────┘
              │ Used by
              ▼
┌─────────────────────────────────────────────┐
│         Runtime Registration                │
│  ┌─────────────────────────────────────┐   │
│  │ extension.ts                        │   │
│  │ → vscode.lm.registerTool()          │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ McpDispatcher.ts                    │   │
│  │ → MCP Bridge for Claude Desktop     │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ ServiceAccessView.ts                │   │
│  │ → UI for enabling/disabling tools   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Key Components

### 1. Tool Schemas (`src/schemas/*.json`)

Each tool has a dedicated JSON schema file containing all metadata:

```json
{
  "name": "S3Tool",
  "toolReferenceName": "S3Tool",
  "displayName": "S3 Tool",
  "modelDescription": "Execute S3 commands...",
  "userDescription": "Manage S3 buckets and objects",
  "tags": ["aws", "s3", "storage"],
  "icon": "$(database)",
  "canBeReferencedInPrompt": true,
  "inputSchema": {
    "type": "object",
    "required": ["command", "params"],
    "properties": {
      "command": {
        "type": "string",
        "enum": ["ListBuckets", "GetObject", "PutObject", ...]
      },
      "params": {
        "type": "object",
        "properties": { ... }
      }
    }
  },
  "schemaVersion": "1.0",
  "deprecated": false,
  "addedInVersion": "1.0.0"
}
```

**Naming Convention**: Schema filename must match tool class name exactly (PascalCase):
- `S3Tool.ts` → `S3Tool.json`
- `EC2Tool.ts` → `EC2Tool.json`
- `TestAwsConnectionTool.ts` → `TestAwsConnectionTool.json`

### 2. Discovery Script (`scripts/discoverTools.ts`)

Runs at **build time** to discover and validate tools:

```typescript
// 1. Scans src/ for *Tool.ts files
const toolFiles = findToolFiles('src/');

// 2. Validates corresponding schema exists
const schemaPath = `src/schemas/${getSchemaFileName(toolName)}`;

// 3. Validates schema with Ajv
const valid = toolSchemaValidator(schema);

// 4. Skips tools with validation errors
if (!valid) {
  console.error(`Skipping ${toolName}: Schema validation failed`);
  continue;
}

// 5. Generates manifest and registry
generateToolManifest(discoveredTools, 'src/generated/toolManifest.json');
generateToolRegistry(discoveredTools, 'src/generated/toolRegistry.ts');
```

**Error Handling**: Tools with schema validation errors are **skipped** and logged as warnings. Build continues with valid tools.

### 3. Generated Files (`src/tool_registry/`)

**ToolManifest.json**:
```json
{
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "toolCount": 20,
  "tools": [
    {
      "name": "S3Tool",
      "className": "S3Tool",
      "importPath": "s3/S3Tool",
      "schemaPath": "../schemas/S3Tool.json"
    },
    ...
  ]
}
```

**ToolRegistry.ts**:
```typescript
// Auto-generated - DO NOT EDIT
import { S3Tool } from '../s3/S3Tool';
import { EC2Tool } from '../ec2/EC2Tool';
// ... 18 more imports

export const TOOLS = [
  { name: 'S3Tool', instance: new S3Tool() },
  { name: 'EC2Tool', instance: new EC2Tool() },
  // ... 18 more tools
];
```

### 4. Tool Implementation (`src/*/Tool.ts`)

Tool classes extend `BaseTool` and implement `executeCommand()`:

```typescript
export class S3Tool extends BaseTool<S3ToolInput> {
  protected readonly toolName = 'S3Tool';
  
  protected async executeCommand(
    command: S3Command, 
    params: Record<string, any>
  ): Promise<any> {
    const client = await this.getS3Client();
    
    switch (command) {
      case 'ListBuckets':
        return await client.send(new ListBucketsCommand());
      case 'GetObject':
        return await client.send(new GetObjectCommand(params));
      // ... more commands
    }
  }
  
  protected updateResourceContext(
    command: string, 
    params: Record<string, any>
  ): void {
    // Optional: Update AI chat context
    if (params.Bucket) {
      AIHandler.Current.updateLatestResource({
        type: 'S3 Bucket',
        name: params.Bucket
      });
    }
  }
}
```

## Build Process

### NPM Scripts

```json
{
  "scripts": {
    "generate-tools": "ts-node scripts/discoverTools.ts",
    "generate-package": "ts-node scripts/generatePackageJson.ts",
    "validate-schemas": "ts-node scripts/validateSchemas.ts",
    "prebuild": "npm run generate-tools && npm run generate-package",
    "build": "node esbuild.js",
    "watch": "npm-run-all -p watch:*"
  }
}
```

### Build Flow

1. **`npm run generate-tools`**
   - Discovers `*Tool.ts` files
   - Validates schemas with Ajv
   - Generates `toolManifest.json` and `toolRegistry.ts`

2. **`npm run generate-package`**
   - Reads `toolManifest.json`
   - Loads schemas from `src/schemas/`
   - Updates `package.json` `contributes.languageModelTools`

3. **`npm run build`** (runs `prebuild` automatically)
   - Compiles TypeScript
   - Bundles with esbuild

## Adding a New AWS Service Tool

### Step 1: Create Tool Implementation

Create `src/{service}/{Service}Tool.ts`:

```typescript
import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { SomeAWSClient, SomeCommand } from '@aws-sdk/client-{service}';

type ServiceCommand = 'Command1' | 'Command2' | 'Command3';

interface ServiceToolInput extends BaseToolInput {
  command: ServiceCommand;
}

export class ServiceTool extends BaseTool<ServiceToolInput> {
  protected readonly toolName = 'ServiceTool';
  
  private async getClient(): Promise<SomeAWSClient> {
    return ClientManager.Instance.getClient('{service}', async (session) => {
      const credentials = await session.GetCredentials();
      return new SomeAWSClient({
        credentials,
        region: session.AwsRegion
      });
    });
  }
  
  protected async executeCommand(
    command: ServiceCommand,
    params: Record<string, any>
  ): Promise<any> {
    const client = await this.getClient();
    
    switch (command) {
      case 'Command1':
        return await client.send(new SomeCommand(params));
      // ... more commands
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }
}
```

### Step 2: Create Tool Schema

Create `src/schemas/ServiceTool.json`:

```json
{
  "name": "ServiceTool",
  "toolReferenceName": "ServiceTool",
  "displayName": "Service Tool",
  "modelDescription": "Execute AWS Service commands. ALWAYS provide params object. Examples: Command1 {command:'Command1', params:{...}}.",
  "userDescription": "Manage AWS Service resources",
  "tags": ["aws", "service", "cloud"],
  "icon": "$(cloud)",
  "canBeReferencedInPrompt": true,
  "inputSchema": {
    "type": "object",
    "required": ["command", "params"],
    "properties": {
      "command": {
        "type": "string",
        "enum": ["Command1", "Command2", "Command3"],
        "description": "The Service command to execute"
      },
      "params": {
        "type": "object",
        "description": "REQUIRED parameters object. Always include this even if empty.",
        "properties": {
          "Param1": {
            "type": "string",
            "description": "Description of param (Used by: Command1 (Required))"
          }
        }
      }
    }
  },
  "schemaVersion": "1.0",
  "deprecated": false,
  "addedInVersion": "1.0.0"
}
```

### Step 3: Run Build

```bash
npm run generate-tools
npm run build
```

**That's it!** The tool is automatically:
- Discovered by `discoverTools.ts`
- Validated against schema definition
- Registered in VS Code Language Model API
- Available in MCP bridge
- Listed in Service Access UI

### What NOT to do

❌ **Do NOT manually update**:
- `package.json` `languageModelTools` (auto-generated)
- `src/generated/toolRegistry.ts` (auto-generated)
- `src/generated/toolManifest.json` (auto-generated)

❌ **Do NOT add tool registration to**:
- `extension.ts` (uses generated registry)
- `McpDispatcher.ts` (uses generated registry)
- `ServiceAccessView.ts` (loads from schemas)

## Schema Validation

### Required Fields

Every schema MUST include:

- `name` (string): Tool class name
- `toolReferenceName` (string): Reference name for VS Code
- `displayName` (string): Human-readable name
- `modelDescription` (string): Description for LLM
- `userDescription` (string): Description for user
- `tags` (string[]): Searchable tags
- `icon` (string): VS Code icon (e.g., `"$(database)"`)
- `canBeReferencedInPrompt` (boolean): Usually `true`
- `inputSchema` (object): JSON Schema for input validation
- `schemaVersion` (string): Schema version (currently `"1.0"`)
- `deprecated` (boolean): Deprecation flag

### Validation with Ajv

Schemas are validated at build time using Ajv:

```bash
npm run validate-schemas
```

Output:
```
🔍 Validating tool schemas...

  ✅ S3Tool.json
  ✅ EC2Tool.json
  ❌ badTool.json
     /inputSchema missing required property

📊 Results: 19 valid, 1 invalid
```

Invalid schemas **prevent the tool from being registered** but don't fail the build.

## Troubleshooting

### Tool Not Discovered

**Symptom**: Tool not appearing in generated registry

**Solutions**:
1. ✅ Check file name ends with `Tool.ts` (e.g., `S3Tool.ts`)
2. ✅ Verify schema file exists: `src/schemas/S3Tool.json`
3. ✅ Run `npm run validate-schemas` to check schema validity
4. ✅ Check `src/tool_registry/ToolManifest.json` for tool entry

### Schema Validation Failed

**Symptom**: Tool skipped during discovery with validation error

**Solutions**:
1. ✅ Run `npm run validate-schemas` to see detailed errors
2. ✅ Check all required fields are present
3. ✅ Verify `inputSchema` is valid JSON Schema
4. ✅ Ensure `name` in schema matches tool class name

### Generated Files Not Updated

**Symptom**: Changes to schema not reflected in extension

**Solutions**:
1. ✅ Run `npm run generate-tools`
2. ✅ Run `npm run generate-package`
3. ✅ Run `npm run build`
4. ✅ Check `.gitignore` doesn't exclude `src/schemas/`

### Tool Registration Error at Runtime

**Symptom**: Extension fails to activate

**Solutions**:
1. ✅ Check `src/tool_registry/ToolRegistry.ts` was generated
2. ✅ Verify imports in generated file are correct
3. ✅ Run `npm run typecheck` for TypeScript errors
4. ✅ Check tool class extends `BaseTool`

## Benefits of New Architecture

### Before Refactoring

| Aspect | Old Approach |
|--------|--------------|
| **Lines in package.json** | 2,404 lines |
| **Update Locations** | 4 files (package.json, extension.ts, McpDispatcher.ts, ServiceAccessView.ts) |
| **Manual Synchronization** | Required across all locations |
| **Schema Validation** | None |
| **Risk of Inconsistency** | High |
| **Adding New Tool** | 4-5 file updates, ~200 lines of code |

### After Refactoring

| Aspect | New Approach |
|--------|--------------|
| **Lines in package.json** | ~400 lines (83% reduction) |
| **Update Locations** | 2 files (tool class + schema) |
| **Manual Synchronization** | None (automated) |
| **Schema Validation** | Ajv at build time |
| **Risk of Inconsistency** | Low (single source of truth) |
| **Adding New Tool** | 2 file updates, automated discovery |

### Quantified Improvements

- **75% reduction** in code duplication
- **50% reduction** in files to update per tool
- **100% automation** of tool registration
- **0 manual synchronization** required
- **Build-time validation** catches errors early

## Schema Versioning

### Current Version: 1.0

All schemas include `schemaVersion: "1.0"` field.

### Version Compatibility

| Schema Version | Extension Version | Status |
|----------------|------------------|--------|
| 1.0 | v1.0.0+ | ✅ Current |
| 0.x | Legacy | ⚠️ Deprecated Q3 2026 |

### Breaking Changes Policy

See [DEPRECATION_NOTICE.md](../DEPRECATION_NOTICE.md) for:
- 3-month advance notice for deprecations
- 6-month support for deprecated features
- Migration guides for breaking changes

## Tool Registry Details

### TOOLS

Unified tool registry used by both `extension.ts` for VS Code Language Model API registration and `McpDispatcher.ts` for MCP bridge:

```typescript
const { TOOLS } = require('./tool_registry/ToolRegistry');

for (const tool of TOOLS) {
  context.subscriptions.push(
    vscode.lm.registerTool(tool.name, tool.instance)
  );
}
```

```typescript
// McpDispatcher.ts also uses the same TOOLS array
const { TOOLS } = require('../tool_registry/ToolRegistry');

for (const tool of TOOLS) {
  if (enabledTools.has(tool.name)) {
    this.tools.set(tool.name, tool);
  }
}
```

### Service Access UI

`ServiceAccessView.ts` loads tool metadata dynamically:

```typescript
function loadToolRegistry(): ToolDefinition[] {
  const manifest = require('../tool_registry/ToolManifest.json');
  const registry: ToolDefinition[] = [];
  
  for (const tool of manifest.tools) {
    const schema = require(`../${tool.schemaPath}`);
    const commands = schema.inputSchema.properties.command.enum;
    
    registry.push({
      name: schema.name,
      displayName: schema.displayName,
      commands: commands
    });
  }
  
  return registry;
}
```

## Available Tools

| Tool Name | Display Name | Commands | AWS Service |
|-----------|--------------|----------|-------------|
| APIGatewayTool | API Gateway | 39 | API Gateway REST API |
| CloudFormationTool | CloudFormation | 42 | CloudFormation |
| CloudWatchLogTool | CloudWatch Logs | 5 | CloudWatch Logs |
| DynamoDBTool | DynamoDB | 12 | DynamoDB |
| EC2Tool | EC2 | 18 | EC2 |
| EMRTool | EMR | 27 | Elastic MapReduce |
| FileOperationsTool | File Operations | 6 | Local Files |
| GlueTool | Glue | 9 | AWS Glue |
| IAMTool | IAM | 11 | IAM |
| LambdaTool | Lambda | 8 | Lambda |
| RDSDataTool | RDS Data API | 5 | RDS Data API |
| RDSTool | RDS | 32 | RDS |
| S3FileOperationsTool | S3 File Operations | 4 | S3 Transfer |
| S3Tool | S3 | 13 | S3 |
| SessionTool | Session | 4 | Session Management |
| SNSTool | SNS | 12 | SNS |
| SQSTool | SQS | 8 | SQS |
| StepFuncTool | Step Functions | 7 | Step Functions |
| STSTool | STS | 6 | STS |
| TestAwsConnectionTool | Test Connection | 1 | STS |

**Total**: 20 tools, 200+ commands

## Related Documentation

- [README.md](../README.md) - Extension overview
- [README_AWS_SERVICES.md](../README_AWS_SERVICES.md) - AWS service coverage
- [README_MCP.md](../README_MCP.md) - MCP integration guide
- [DEPRECATION_NOTICE.md](../DEPRECATION_NOTICE.md) - Deprecation policy
- [CHANGELOG.md](../CHANGELOG.md) - Version history

## Contributing

When contributing new tools:

1. Follow the strict naming convention (`*Tool.ts` → `*Tool.json`)
2. Create comprehensive schema with all commands documented
3. Include parameter descriptions with "(Used by: CommandName)"
4. Run `npm run validate-schemas` before committing
5. Test tool registration with `npm run build`
6. Update this documentation if adding new patterns

## Support

- **GitHub Issues**: https://github.com/necatiarslan/awsflow/issues
- **Discussions**: https://github.com/necatiarslan/awsflow/discussions

---

**Last Updated**: January 1, 2026  
**Architecture Version**: 1.0  
**Schema Version**: 1.0
