#!/usr/bin/env ts-node
"use strict";
/**
 * Extract Tool Schemas from package.json
 *
 * Reads languageModelTools from package.json and creates individual
 * schema files in src/schemas/ directory
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getSchemaFileName(toolName) {
    // Convert ClassName to camelCase for schema file
    // TestAwsConnectionTool -> testAwsConnectionTool.json
    return toolName.charAt(0).toLowerCase() + toolName.slice(1) + '.json';
}
// Read package.json
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const schemasDir = path.join(rootDir, 'src', 'schemas');
console.log('\n📦 Extracting tool schemas from package.json...\n');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const tools = packageJson.contributes?.languageModelTools || [];
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
//# sourceMappingURL=extractSchemas.js.map