#!/usr/bin/env ts-node
"use strict";
/**
 * Validate Tool Schemas
 *
 * Validates all schema files in src/schemas/ against the tool schema definition
 * Can be run standalone for validation checks
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({ allErrors: true, strict: false });
(0, ajv_formats_1.default)(ajv);
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
        }
        else {
            console.error(`  ❌ ${schemaFile}`);
            toolSchemaValidator.errors?.forEach(err => {
                console.error(`     ${err.instancePath} ${err.message}`);
            });
            invalidCount++;
        }
    }
    catch (error) {
        console.error(`  ❌ ${schemaFile}: ${error.message}`);
        invalidCount++;
    }
}
console.log(`\n📊 Results: ${validCount} valid, ${invalidCount} invalid\n`);
if (invalidCount > 0) {
    process.exit(1);
}
//# sourceMappingURL=validateSchemas.js.map