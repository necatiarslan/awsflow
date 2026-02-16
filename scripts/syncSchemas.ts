#!/usr/bin/env ts-node
/**
 * Sync tool schemas from tool_registry to src/schemas
 */

import * as fs from 'fs';
import * as path from 'path';

const rootDir = path.join(__dirname, '..');
const sourceDir = path.join(rootDir, 'tool_registry');
const destDir = path.join(rootDir, 'src', 'schemas');
const manifestName = 'ToolManifest.json';

console.log('\n\ud83d\udd04 Syncing tool schemas...\n');

if (!fs.existsSync(sourceDir)) {
  console.error(`\u274c Source directory not found: ${sourceDir}`);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const sourceFiles = fs
  .readdirSync(sourceDir)
  .filter((file) => file.endsWith('.json') && file !== manifestName);

const destFiles = fs
  .readdirSync(destDir)
  .filter((file) => file.endsWith('.json'));

const sourceSet = new Set(sourceFiles);

let removed = 0;
for (const file of destFiles) {
  if (!sourceSet.has(file)) {
    fs.unlinkSync(path.join(destDir, file));
    removed++;
  }
}

let copied = 0;
for (const file of sourceFiles) {
  const srcPath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  fs.copyFileSync(srcPath, destPath);
  copied++;
}

console.log(`  \u2705 Copied: ${copied}`);
console.log(`  \u2705 Removed: ${removed}`);
console.log(`\n\u2728 Synced schemas to ${destDir}\n`);
