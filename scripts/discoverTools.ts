#!/usr/bin/env ts-node
/**
 * Tool Discovery Script
 * 
 * Scans src/ directory for *Tool.ts files and generates:
 * - src/generated/toolManifest.json: List of discovered tools
 * - src/generated/toolRegistry.ts: Static tool registration code
 * 
 * Enforces strict naming: S3Tool.ts must have src/schemas/s3Tool.json
 * Validates schemas with Ajv, skips tools with validation errors
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

interface ToolSchema {
  name: string;
  toolReferenceName: string;
  displayName: string;
  modelDescription: string;
  userDescription: string;
  tags: string[];
  icon: string;
  canBeReferencedInPrompt: boolean;
  inputSchema: any;
  schemaVersion: string;
  deprecated: boolean;
  addedInVersion?: string;
}

interface DiscoveredTool {
  name: string;
  filePath: string;
  schemaPath: string;
  className: string;
  importPath: string;
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Schema for validating tool schemas
const toolSchemaValidator = ajv.compile({
  type: 'object',
  required: [
    'name',
    'toolReferenceName',
    'displayName',
    'modelDescription',
    'userDescription',
    'tags',
    'icon',
    'canBeReferencedInPrompt',
    'inputSchema',
    'schemaVersion',
    'deprecated'
  ],
  properties: {
    name: { type: 'string' },
    toolReferenceName: { type: 'string' },
    displayName: { type: 'string' },
    modelDescription: { type: 'string' },
    userDescription: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    icon: { type: 'string' },
    canBeReferencedInPrompt: { type: 'boolean' },
    inputSchema: { type: 'object' },
    schemaVersion: { type: 'string' },
    deprecated: { type: 'boolean' },
    addedInVersion: { type: 'string' }
  }
});

function findToolFiles(srcDir: string): string[] {
  const toolFiles: string[] = [];
  
  function scanDirectory(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, generated, .git, etc.
        if (!['node_modules', 'generated', '.git', 'dist', 'out'].includes(entry.name)) {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('Tool.ts')) {
        toolFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(srcDir);
  return toolFiles;
}

function getSchemaFileName(toolClassName: string): string {
  // Schema file name matches tool class name exactly (PascalCase)
  // S3Tool -> S3Tool.json
  // EC2Tool -> EC2Tool.json
  // TestAwsConnectionTool -> TestAwsConnectionTool.json
  return toolClassName + '.json';
}

function validateSchema(schemaPath: string): { valid: boolean; schema?: ToolSchema; errors?: string[] } {
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    
    const valid = toolSchemaValidator(schema);
    
    if (!valid) {
      const errors = toolSchemaValidator.errors?.map(err => 
        `${err.instancePath} ${err.message}`
      ) || ['Unknown validation error'];
      return { valid: false, errors };
    }
    
    return { valid: true, schema };
  } catch (error) {
    return { valid: false, errors: [(error as Error).message] };
  }
}

function discoverTools(srcDir: string, schemasDir: string): DiscoveredTool[] {
  const toolFiles = findToolFiles(srcDir);
  const discoveredTools: DiscoveredTool[] = [];
  
  console.log(`\n🔍 Discovering tools in ${srcDir}...\n`);
  
  for (const toolFile of toolFiles) {
    const fileName = path.basename(toolFile);
    const className = fileName.replace('.ts', '');
    const schemaFileName = getSchemaFileName(className);
    const schemaPath = path.join(schemasDir, schemaFileName);
    
    console.log(`  Found: ${className}`);
    
    // Check if schema exists
    if (!fs.existsSync(schemaPath)) {
      console.warn(`  ⚠️  Skipping ${className}: Schema not found at ${schemaPath}`);
      continue;
    }
    
    // Validate schema
    const validation = validateSchema(schemaPath);
    if (!validation.valid) {
      console.error(`  ❌ Skipping ${className}: Schema validation failed`);
      validation.errors?.forEach(err => console.error(`     ${err}`));
      continue;
    }
    
    // Check naming match
    if (validation.schema!.name !== className) {
      console.warn(`  ⚠️  Skipping ${className}: Schema name mismatch (expected: ${className}, got: ${validation.schema!.name})`);
      continue;
    }
    
    // Generate import path relative to src/
    const relativePath = path.relative(srcDir, toolFile).replace(/\\/g, '/').replace('.ts', '');
    
    discoveredTools.push({
      name: className,
      filePath: toolFile,
      schemaPath,
      className,
      importPath: relativePath
    });
    
    console.log(`  ✅ ${className} validated`);
  }
  
  console.log(`\n✨ Discovered ${discoveredTools.length} valid tools\n`);
  
  return discoveredTools;
}

function generateToolManifest(tools: DiscoveredTool[], outputPath: string): void {
  const manifest = {
    toolCount: tools.length,
    tools: tools.map(t => ({
      name: t.name,
      className: t.className,
      importPath: t.importPath,
      schemaPath: path.relative(path.dirname(outputPath), t.schemaPath).replace(/\\/g, '/')
    }))
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`📄 Generated manifest: ${outputPath}`);
}

function generateToolRegistry(tools: DiscoveredTool[], manifestPath: string, outputPath: string): void {
  const imports = tools.map(t => 
    `import { ${t.className} } from '../${t.importPath}';`
  ).join('\n');
  
  const toolsList = tools.map(t => 
    `  { name: '${t.name}', instance: new ${t.className}() }`
  ).join(',\n');
  
  const code = `/**
 * Auto-generated Tool Registry
 * 
 * DO NOT EDIT THIS FILE MANUALLY
 * Run 'npm run generate-tools' to regenerate
 */

${imports}

export interface ToolRegistryEntry {
  name: string;
  instance: any;
}

/**
 * Unified tool registry for both VS Code Language Model API and MCP bridge
 */
export const TOOLS: ToolRegistryEntry[] = [
${toolsList}
];

/**
 * Get tool metadata from schemas
 */
export async function getToolMetadata(toolName: string): Promise<any> {
  const manifest = require('./toolManifest.json');
  const tool = manifest.tools.find((t: any) => t.name === toolName);
  
  if (!tool) {
    throw new Error(\`Tool not found: \${toolName}\`);
  }
  
  const schemaPath = require('path').join(__dirname, tool.schemaPath);
  return require(schemaPath);
}

/**
 * Get all tool metadata
 */
export async function getAllToolMetadata(): Promise<any[]> {
  const manifest = require('./toolManifest.json');
  return Promise.all(
    manifest.tools.map((t: any) => {
      const schemaPath = require('path').join(__dirname, t.schemaPath);
      return require(schemaPath);
    })
  );
}
`;
  
  fs.writeFileSync(outputPath, code, 'utf-8');
  console.log(`📄 Generated registry: ${outputPath}`);
}

// Main execution
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const schemasDir = path.join(srcDir, 'schemas');
const generatedDir = path.join(srcDir, 'tool_registry');

// Ensure directories exist
if (!fs.existsSync(schemasDir)) {
  console.error(`❌ Schemas directory not found: ${schemasDir}`);
  process.exit(1);
}

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Discover tools
const tools = discoverTools(srcDir, schemasDir);

if (tools.length === 0) {
  console.error('❌ No valid tools discovered');
  process.exit(1);
}

// Generate output files
const manifestPath = path.join(generatedDir, 'ToolManifest.json');
const registryPath = path.join(generatedDir, 'ToolRegistry.ts');

generateToolManifest(tools, manifestPath);
generateToolRegistry(tools, manifestPath, registryPath);

console.log(`\n✅ Tool discovery complete!\n`);
