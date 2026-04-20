import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf-8');
const docsLowToken = fs.readFileSync(path.join(root, 'docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md'), 'utf-8');

const failures = [];

if (packageJson.version !== '0.8.0') failures.push(`package.json version must be 0.8.0, got ${packageJson.version}`);
if (!String(packageJson.description || '').includes('v8 finalized')) failures.push('package.json description must mention v8 finalized.');
if (!readme.includes('Runnable Starter V8 Finalized')) failures.push('README title must mention V8 Finalized.');
if (!readme.includes('docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md')) failures.push('README must point to the low-token method doc.');
if (!docsLowToken.toLowerCase().includes('low-token')) failures.push('Low-token master doc must explicitly mention low-token.');

for (const relative of ['README.md', 'docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md']) {
  const text = fs.readFileSync(path.join(root, relative), 'utf-8');
  if (/V5 Finalized|v5 finalized|V6 Audited|V4 FINALIZED|V7 Finalized|v7 finalized/.test(text)) {
    failures.push(`${relative} still contains stale version markers.`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Metadata consistency OK.');
