#!/usr/bin/env ts-node
"use strict";
/**
 * Generate package.json languageModelTools
 *
 * Reads tool manifest and schemas, merges into package.json
 * Preserves all other package.json fields
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
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const manifestPath = path.join(rootDir, 'src', 'generated', 'toolManifest.json');
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
const tools = [];
for (const tool of manifest.tools) {
    const schemaPath = path.join(schemasDir, tool.schemaPath.split('/').pop());
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
    }
    catch (error) {
        console.error(`  ❌ Failed to load schema for ${tool.name}: ${error.message}`);
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
//# sourceMappingURL=generatePackageJson.js.map