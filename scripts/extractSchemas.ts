#!/usr/bin/env ts-node
/**
 * Extract Tool Schemas from package.json
 * 
 * Reads languageModelTools from package.json and creates individual
 * schema files in src/schemas/ directory
 */

import * as fs from 'fs';
import * as path from 'path';

interface ToolDefinition {
  name: string;
  toolReferenceName: string;
  displayName: string;
  modelDescription: string;
  userDescription: string;
  tags: string[];
  icon: string;
  canBeReferencedInPrompt: boolean;
  inputSchema: any;
}

function getSchemaFileName(toolName: string): string {
  // Schema file name matches tool class name exactly (PascalCase)
  // TestAwsConnectionTool -> TestAwsConnectionTool.json
  return toolName + '.json';
}

// Read package.json
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const schemasDir = path.join(rootDir, 'src', 'schemas');

console.log('\n📦 Extracting tool schemas from package.json...\n');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const tools: ToolDefinition[] = packageJson.contributes?.languageModelTools || [];

if (tools.length === 0) {
  console.error('❌ No tools found in package.json');
  process.exit(1);
}

// Ensure schemas directory exists
if (!fs.existsSync(schemasDir)) {
  fs.mkdirSync(schemasDir, { recursive: true });
}

// Extract each tool
for (const tool of tools) {
  const schemaFileName = getSchemaFileName(tool.name);
  const schemaPath = path.join(schemasDir, schemaFileName);
  
  const schema = {
    name: tool.name,
    toolReferenceName: tool.toolReferenceName,
    displayName: tool.displayName,
    modelDescription: tool.modelDescription,
    userDescription: tool.userDescription,
    tags: tool.tags,
    icon: tool.icon,
    canBeReferencedInPrompt: tool.canBeReferencedInPrompt,
    inputSchema: tool.inputSchema,
    schemaVersion: '1.0',
    deprecated: false,
    addedInVersion: '1.0.0'
  };
  
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf-8');
  console.log(`  ✅ ${tool.name} -> ${schemaFileName}`);
}

console.log(`\n✨ Extracted ${tools.length} tool schemas to ${schemasDir}\n`);
