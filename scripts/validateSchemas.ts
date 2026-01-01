#!/usr/bin/env ts-node
/**
 * Validate Tool Schemas
 * 
 * Validates all schema files in src/schemas/ against the tool schema definition
 * Can be run standalone for validation checks
 */

import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

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

const rootDir = path.join(__dirname, '..');
const schemasDir = path.join(rootDir, 'src', 'schemas');

console.log('\n🔍 Validating tool schemas...\n');

const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.json'));
let validCount = 0;
let invalidCount = 0;

for (const schemaFile of schemaFiles) {
  const schemaPath = path.join(schemasDir, schemaFile);
  
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    
    const valid = toolSchemaValidator(schema);
    
    if (valid) {
      console.log(`  ✅ ${schemaFile}`);
      validCount++;
    } else {
      console.error(`  ❌ ${schemaFile}`);
      toolSchemaValidator.errors?.forEach(err => {
        console.error(`     ${err.instancePath} ${err.message}`);
      });
      invalidCount++;
    }
  } catch (error) {
    console.error(`  ❌ ${schemaFile}: ${(error as Error).message}`);
    invalidCount++;
  }
}

console.log(`\n📊 Results: ${validCount} valid, ${invalidCount} invalid\n`);

if (invalidCount > 0) {
  process.exit(1);
}
