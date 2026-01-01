# How to Add a New AWS Service

This guide provides step-by-step instructions for adding a new AWS service to the Awsflow extension.

## Overview

Adding a new service requires creating **2 files**:
1. **Tool Class** (`src/{service}/{Service}Tool.ts`) - Implementation
2. **Tool Schema** (`src/schemas/{Service}Tool.json`) - Metadata

Then run `npm run build` and the tool is automatically discovered, validated, and registered!

---

## Step-by-Step Guide

### Step 1: Install AWS SDK Package

Install the AWS SDK client for your service:

```bash
npm install @aws-sdk/client-{service}
```

**Example for ECS:**
```bash
npm install @aws-sdk/client-ecs
```

### Step 2: Create Service Directory

Create a new directory under `src/` for your service:

```bash
mkdir src/ecs
```

### Step 3: Create Tool Class

Create `src/{service}/{Service}Tool.ts` following this template:

```typescript
import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import { AIHandler } from '../chat/AIHandler';
import {
    ECSClient,
    ListClustersCommand,
    DescribeClustersCommand,
    // ... other commands
} from '@aws-sdk/client-ecs';

// Define command types
type ECSCommand =
    | 'ListClusters'
    | 'DescribeClusters'
    | 'ListServices'
    | 'DescribeServices'
    | 'DescribeTasks';

// Define input interface
interface ECSToolInput extends BaseToolInput {
    command: ECSCommand;
}

export class ECSTool extends BaseTool<ECSToolInput> {
    protected readonly toolName = 'ECSTool';

    // Get AWS SDK client
    private async getECSClient(): Promise<ECSClient> {
        return ClientManager.Instance.getClient('ecs', async (session) => {
            const credentials = await session.GetCredentials();
            return new ECSClient({
                credentials,
                region: session.AwsRegion,
            });
        });
    }

    // Update AI chat context (optional but recommended)
    protected updateResourceContext(
        command: string,
        params: Record<string, any>
    ): void {
        if (params.cluster && typeof params.cluster === 'string') {
            AIHandler.Current.updateLatestResource({
                type: 'ECS Cluster',
                name: params.cluster
            });
        }
    }

    // Execute commands
    protected async executeCommand(
        command: ECSCommand,
        params: Record<string, any>
    ): Promise<any> {
        const client = await this.getECSClient();

        switch (command) {
            case 'ListClusters':
                return await client.send(
                    new ListClustersCommand(params)
                );

            case 'DescribeClusters':
                return await client.send(
                    new DescribeClustersCommand(params)
                );

            case 'ListServices':
                return await client.send(
                    new ListServicesCommand(params)
                );

            case 'DescribeServices':
                return await client.send(
                    new DescribeServicesCommand(params)
                );

            case 'DescribeTasks':
                return await client.send(
                    new DescribeTasksCommand(params)
                );

            default:
                throw new Error(`Unknown ECS command: ${command}`);
        }
    }
}
```

**Key Points:**
- Extend `BaseTool<YourToolInput>`
- Set `toolName` to match your class name
- Implement `getClient()` using `ClientManager`
- Implement `executeCommand()` with switch statement
- Optionally implement `updateResourceContext()` for AI context
- Handle all commands defined in your schema

### Step 4: Create Tool Schema

Create `src/schemas/{Service}Tool.json` following this template:

```json
{
  "name": "ECSTool",
  "toolReferenceName": "ECSTool",
  "displayName": "ECS Tool",
  "modelDescription": "Execute AWS ECS (Elastic Container Service) commands. ALWAYS provide params object. Examples: ListClusters {command:'ListClusters', params:{}}. DescribeClusters {command:'DescribeClusters', params:{clusters:['my-cluster']}}. ListServices {command:'ListServices', params:{cluster:'my-cluster'}}.",
  "userDescription": "Manage ECS clusters, services, tasks, and container instances",
  "tags": [
    "aws",
    "ecs",
    "containers",
    "docker"
  ],
  "icon": "$(server-process)",
  "canBeReferencedInPrompt": true,
  "inputSchema": {
    "type": "object",
    "required": [
      "command",
      "params"
    ],
    "properties": {
      "command": {
        "type": "string",
        "enum": [
          "ListClusters",
          "DescribeClusters",
          "ListServices",
          "DescribeServices",
          "DescribeTasks"
        ],
        "description": "The ECS command to execute"
      },
      "params": {
        "type": "object",
        "description": "REQUIRED parameters object. Always include this even if empty. Use native ECS API field names.",
        "properties": {
          "cluster": {
            "type": "string",
            "description": "Cluster name or ARN (Used by: DescribeClusters, ListServices (Required), DescribeServices (Required), DescribeTasks (Required))"
          },
          "clusters": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of cluster names or ARNs (Used by: DescribeClusters (Required))"
          },
          "services": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of service names or ARNs (Used by: DescribeServices (Required))"
          },
          "tasks": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of task IDs or ARNs (Used by: DescribeTasks (Required))"
          },
          "maxResults": {
            "type": "number",
            "description": "Maximum number of results (Used by: ListClusters, ListServices)"
          },
          "nextToken": {
            "type": "string",
            "description": "Pagination token (Used by: ListClusters, ListServices)"
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

**Schema Field Guide:**

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `name` | ✅ Yes | Tool class name (PascalCase) | `"ECSTool"` |
| `toolReferenceName` | ✅ Yes | Same as name | `"ECSTool"` |
| `displayName` | ✅ Yes | Human-readable name | `"ECS Tool"` |
| `modelDescription` | ✅ Yes | Description for LLM with examples | See template |
| `userDescription` | ✅ Yes | Short user-facing description | `"Manage ECS resources"` |
| `tags` | ✅ Yes | Searchable keywords | `["aws", "ecs", "containers"]` |
| `icon` | ✅ Yes | VS Code codicon | `"$(server-process)"` |
| `canBeReferencedInPrompt` | ✅ Yes | Usually `true` | `true` |
| `inputSchema` | ✅ Yes | JSON Schema for parameters | See template |
| `schemaVersion` | ✅ Yes | Current: `"1.0"` | `"1.0"` |
| `deprecated` | ✅ Yes | Deprecation flag | `false` |
| `addedInVersion` | No | Version when added | `"1.0.0"` |

**Common VS Code Icons:**
- `$(database)` - Databases (RDS, DynamoDB)
- `$(cloud)` - General AWS services
- `$(server-process)` - Compute services (ECS, EKS)
- `$(vm)` - Virtual machines (EC2)
- `$(inbox)` - Queues (SQS)
- `$(megaphone)` - Notifications (SNS)
- `$(circuit-board)` - Workflows (Step Functions)
- `$(key)` - Security (IAM, STS)
- `$(tools)` - Infrastructure (CloudFormation)
- `$(list-selection)` - Logs (CloudWatch)

### Step 5: Build and Test

Run the build process:

```bash
npm run build
```

This will:
1. ✅ Discover your new tool (`ECSTool.ts`)
2. ✅ Validate the schema (`ECSTool.json`)
3. ✅ Generate registration code
4. ✅ Update `package.json`
5. ✅ Compile the extension

**Expected Output:**
```
🔍 Discovering tools in /Users/.../awsflow/src...

  Found: ECSTool
  ✅ ECSTool validated

✨ Discovered 21 valid tools

📄 Generated manifest: src/tool_registry/ToolManifest.json
📄 Generated registry: src/tool_registry/ToolRegistry.ts

✅ Tool discovery complete!

📦 Generating package.json languageModelTools...
  ✅ ECSTool

✨ Generated 21 tool definitions in package.json
```

### Step 6: Validate Schema (Optional)

Run schema validation standalone:

```bash
npm run validate-schemas
```

### Step 7: Test in VS Code

1. Press `F5` to launch the Extension Development Host
2. Open a chat window
3. Test your tool:
   ```
   @aws list my ECS clusters
   @aws describe the tasks in my-cluster
   ```

### Step 8: Update Documentation

Update relevant documentation files:

1. **README_AWS_SERVICES.md** - Add service to the list
2. **README.md** - Add to supported services table
3. **CHANGELOG.md** - Document the new service

---

## Adding New Commands to Existing Service

To add commands to an existing service:

### 1. Update Tool Class

Add the new command to the type and implement it:

```typescript
// Add to command type
type S3Command =
    | 'ListBuckets'
    | 'GetObject'
    | 'PutObject'
    | 'NewCommand';  // ← Add here

// Implement in executeCommand
protected async executeCommand(
    command: S3Command,
    params: Record<string, any>
): Promise<any> {
    const client = await this.getS3Client();
    
    switch (command) {
        // ... existing commands
        
        case 'NewCommand':  // ← Add implementation
            return await client.send(new NewCommand(params));
        
        default:
            throw new Error(`Unknown S3 command: ${command}`);
    }
}
```

### 2. Update Tool Schema

Add the command to the schema's enum and document parameters:

```json
{
  "inputSchema": {
    "properties": {
      "command": {
        "enum": [
          "ListBuckets",
          "GetObject",
          "NewCommand"  // ← Add here
        ]
      },
      "params": {
        "properties": {
          "newParam": {  // ← Add new parameters
            "type": "string",
            "description": "Description (Used by: NewCommand (Required))"
          }
        }
      }
    }
  }
}
```

### 3. Rebuild

```bash
npm run build
```

---

## Common Patterns

### Handling Pagination

```typescript
protected async executeCommand(
    command: ServiceCommand,
    params: Record<string, any>
): Promise<any> {
    const client = await this.getClient();
    
    // BaseTool automatically handles pagination via PaginationToken
    return await client.send(new ListCommand(params));
}
```

The `BaseTool` class automatically:
- Extracts pagination tokens from responses
- Includes them in the response for follow-up requests
- Handles `nextToken`, `NextToken`, `Marker`, etc.

### Resource Context for AI

```typescript
protected updateResourceContext(
    command: string,
    params: Record<string, any>
): void {
    // Update AI context when working with specific resources
    if (params.bucketName) {
        AIHandler.Current.updateLatestResource({
            type: 'S3 Bucket',
            name: params.bucketName
        });
    }
    
    if (params.tableName) {
        AIHandler.Current.updateLatestResource({
            type: 'DynamoDB Table',
            name: params.tableName
        });
    }
}
```

This helps the AI:
- Remember the current resource
- Make context-aware suggestions
- Auto-fill parameters in follow-up commands

### Custom Endpoint Support

```typescript
private async getClient(): Promise<ServiceClient> {
    return ClientManager.Instance.getClient('service', async (session) => {
        const credentials = await session.GetCredentials();
        return new ServiceClient({
            credentials,
            region: session.AwsRegion,
            endpoint: session.AwsEndPoint,  // Support custom endpoints
            forcePathStyle: true,  // For S3-compatible services
        });
    });
}
```

### Error Handling

The `BaseTool` base class automatically:
- ✅ Catches and formats AWS SDK errors
- ✅ Logs errors to the output channel
- ✅ Returns structured error responses
- ✅ Tracks failed commands in history

You don't need to add try-catch blocks unless you need custom error handling.

---

## Troubleshooting

### Tool Not Discovered

**Problem:** Tool doesn't appear after building

**Solutions:**
1. ✅ Check file name matches pattern: `*Tool.ts` (e.g., `ECSTool.ts`)
2. ✅ Verify schema file exists: `src/schemas/ECSTool.json`
3. ✅ Ensure schema `name` matches class name exactly
4. ✅ Check `src/tool_registry/ToolManifest.json` for your tool

### Schema Validation Failed

**Problem:** Tool skipped during discovery

**Solutions:**
1. ✅ Run `npm run validate-schemas` for detailed errors
2. ✅ Verify all required fields are present
3. ✅ Check `inputSchema.required` includes `["command", "params"]`
4. ✅ Ensure `schemaVersion` is `"1.0"`

### TypeScript Compilation Errors

**Problem:** Build fails with type errors

**Solutions:**
1. ✅ Verify tool class extends `BaseTool<YourToolInput>`
2. ✅ Check command type matches schema enum
3. ✅ Ensure all imports are correct
4. ✅ Run `npm run typecheck` for detailed errors

### Tool Registered But Not Working

**Problem:** Tool appears but fails at runtime

**Solutions:**
1. ✅ Check AWS SDK client initialization
2. ✅ Verify all commands in schema are implemented
3. ✅ Test with AWS CLI to ensure credentials work
4. ✅ Check extension output logs for error messages

---

## Best Practices

### ✅ Do's

- **Use descriptive command names** - `DescribeInstances` not `GetEC2`
- **Follow AWS SDK naming** - Use official AWS API names
- **Document all parameters** - Include "(Used by: Command (Required))"
- **Add usage examples** - Include in `modelDescription`
- **Update AI context** - Implement `updateResourceContext()`
- **Test with real AWS APIs** - Verify against actual AWS services
- **Keep schemas in sync** - Command enums must match implementations

### ❌ Don'ts

- **Don't manually edit generated files** - `ToolRegistry.ts`, `ToolManifest.json`
- **Don't skip schema validation** - Always run `npm run validate-schemas`
- **Don't use generic names** - `Tool`, `AWSService`, `Handler`
- **Don't forget to export** - Tool class must be exported
- **Don't hardcode regions** - Use `session.AwsRegion`
- **Don't skip error handling** - Let BaseTool handle it
- **Don't add to package.json** - It's auto-generated

---

## Example: Complete EKS Tool

Here's a complete example for AWS EKS:

**src/eks/EKSTool.ts:**
```typescript
import { BaseTool, BaseToolInput } from '../common/BaseTool';
import { ClientManager } from '../common/ClientManager';
import { AIHandler } from '../chat/AIHandler';
import {
    EKSClient,
    ListClustersCommand,
    DescribeClusterCommand,
    ListNodegroupsCommand,
    DescribeNodegroupCommand,
} from '@aws-sdk/client-eks';

type EKSCommand =
    | 'ListClusters'
    | 'DescribeCluster'
    | 'ListNodegroups'
    | 'DescribeNodegroup';

interface EKSToolInput extends BaseToolInput {
    command: EKSCommand;
}

export class EKSTool extends BaseTool<EKSToolInput> {
    protected readonly toolName = 'EKSTool';

    private async getEKSClient(): Promise<EKSClient> {
        return ClientManager.Instance.getClient('eks', async (session) => {
            const credentials = await session.GetCredentials();
            return new EKSClient({
                credentials,
                region: session.AwsRegion,
            });
        });
    }

    protected updateResourceContext(
        command: string,
        params: Record<string, any>
    ): void {
        if (params.name && typeof params.name === 'string') {
            AIHandler.Current.updateLatestResource({
                type: 'EKS Cluster',
                name: params.name
            });
        }
    }

    protected async executeCommand(
        command: EKSCommand,
        params: Record<string, any>
    ): Promise<any> {
        const client = await this.getEKSClient();

        switch (command) {
            case 'ListClusters':
                return await client.send(new ListClustersCommand(params));

            case 'DescribeCluster':
                return await client.send(new DescribeClusterCommand(params));

            case 'ListNodegroups':
                return await client.send(new ListNodegroupsCommand(params));

            case 'DescribeNodegroup':
                return await client.send(new DescribeNodegroupCommand(params));

            default:
                throw new Error(`Unknown EKS command: ${command}`);
        }
    }
}
```

**src/schemas/EKSTool.json:**
```json
{
  "name": "EKSTool",
  "toolReferenceName": "EKSTool",
  "displayName": "EKS Tool",
  "modelDescription": "Execute AWS EKS (Elastic Kubernetes Service) commands. ALWAYS provide params object. Examples: ListClusters {command:'ListClusters', params:{}}. DescribeCluster {command:'DescribeCluster', params:{name:'my-cluster'}}. ListNodegroups {command:'ListNodegroups', params:{clusterName:'my-cluster'}}.",
  "userDescription": "Manage EKS clusters, node groups, and add-ons",
  "tags": ["aws", "eks", "kubernetes", "k8s"],
  "icon": "$(server-process)",
  "canBeReferencedInPrompt": true,
  "inputSchema": {
    "type": "object",
    "required": ["command", "params"],
    "properties": {
      "command": {
        "type": "string",
        "enum": [
          "ListClusters",
          "DescribeCluster",
          "ListNodegroups",
          "DescribeNodegroup"
        ],
        "description": "The EKS command to execute"
      },
      "params": {
        "type": "object",
        "description": "REQUIRED parameters object. Always include this even if empty.",
        "properties": {
          "name": {
            "type": "string",
            "description": "Cluster name (Used by: DescribeCluster (Required))"
          },
          "clusterName": {
            "type": "string",
            "description": "Cluster name (Used by: ListNodegroups (Required), DescribeNodegroup (Required))"
          },
          "nodegroupName": {
            "type": "string",
            "description": "Node group name (Used by: DescribeNodegroup (Required))"
          },
          "maxResults": {
            "type": "number",
            "description": "Maximum results (Used by: ListClusters, ListNodegroups)"
          },
          "nextToken": {
            "type": "string",
            "description": "Pagination token (Used by: ListClusters, ListNodegroups)"
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

**Build and test:**
```bash
npm run build
# Test in VS Code: @aws list my EKS clusters
```

---

## Checklist

Use this checklist when adding a new service:

- [ ] Install AWS SDK package (`npm install @aws-sdk/client-{service}`)
- [ ] Create service directory (`src/{service}/`)
- [ ] Create tool class (`src/{service}/{Service}Tool.ts`)
  - [ ] Extends `BaseTool`
  - [ ] Defines command type
  - [ ] Implements `getClient()`
  - [ ] Implements `executeCommand()`
  - [ ] Optionally implements `updateResourceContext()`
  - [ ] Exports class
- [ ] Create tool schema (`src/schemas/{Service}Tool.json`)
  - [ ] Correct `name` (matches class)
  - [ ] Descriptive `modelDescription` with examples
  - [ ] All commands in `enum`
  - [ ] All parameters documented
  - [ ] Correct `schemaVersion: "1.0"`
  - [ ] Set `deprecated: false`
- [ ] Run `npm run build`
- [ ] Verify in build output (tool discovered ✅)
- [ ] Test in Extension Development Host
- [ ] Update documentation
  - [ ] README_AWS_SERVICES.md
  - [ ] README.md
  - [ ] CHANGELOG.md

---

## Support

- **Architecture Documentation**: [docs/language_tools.md](language_tools.md)
- **GitHub Issues**: https://github.com/necatiarslan/awsflow/issues
- **Example Tools**: See `src/s3/S3Tool.ts`, `src/ec2/EC2Tool.ts`

---

**Happy coding! 🚀**
