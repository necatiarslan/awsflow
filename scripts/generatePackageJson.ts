#!/usr/bin/env ts-node
/**
 * Generate package.json languageModelTools
 * 
 * Reads tool manifest and schemas, merges into package.json
 * Preserves all other package.json fields
 */

import * as fs from 'fs';
import * as path from 'path';

const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const manifestPath = path.join(rootDir, 'src', 'tool_registry', 'ToolManifest.json');
const schemasDir = path.join(rootDir, 'src', 'schemas');

console.log('\n📦 Generating package.json languageModelTools...\n');

// Check if manifest exists
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Tool manifest not found. Run "npm run generate-tools" first.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Read manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Load all schemas
const tools: any[] = [];

for (const tool of manifest.tools) {
  const schemaPath = path.join(schemasDir, tool.schemaPath.split('/').pop()!);
  
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    
    // Convert schema format to package.json format (remove extra fields)
    const packageTool = {
      name: schema.name,
      toolReferenceName: schema.toolReferenceName,
      displayName: schema.displayName,
      modelDescription: schema.modelDescription,
      userDescription: schema.userDescription,
      tags: schema.tags,
      icon: schema.icon,
      canBeReferencedInPrompt: schema.canBeReferencedInPrompt,
      inputSchema: schema.inputSchema
    };
    
    tools.push(packageTool);
    console.log(`  ✅ ${schema.name}`);
  } catch (error) {
    console.error(`  ❌ Failed to load schema for ${tool.name}: ${(error as Error).message}`);
  }
}

// Update package.json
if (!packageJson.contributes) {
  packageJson.contributes = {};
}

packageJson.contributes.languageModelTools = tools;

// Write back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');

console.log(`\n✨ Generated ${tools.length} tool definitions in package.json\n`);
console.log(`📄 Updated: ${packageJsonPath}\n`);
