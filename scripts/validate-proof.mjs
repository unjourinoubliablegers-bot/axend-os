import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const defaultPath = path.join(root, 'axend/proofs/latest-proof.json');
const targetPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultPath;

if (!fs.existsSync(targetPath)) {
  console.error(`Proof file not found: ${targetPath}`);
  process.exit(1);
}

const proof = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
const required = ['id', 'lotId', 'kind', 'status', 'summary'];
const missing = required.filter((key) => !(key in proof));
if (missing.length) {
  console.error(`Proof invalid. Missing keys: ${missing.join(', ')}`);
  process.exit(1);
}

const allowedStatus = new Set(['pending', 'validated', 'rejected']);
if (!allowedStatus.has(proof.status)) {
  console.error(`Proof invalid. Unsupported status: ${proof.status}`);
  process.exit(1);
}

if (proof.items !== undefined) {
  if (!Array.isArray(proof.items)) {
    console.error('Proof invalid. items must be an array when present.');
    process.exit(1);
  }
  for (const [index, item] of proof.items.entries()) {
    if (!item || typeof item !== 'object' || typeof item.label !== 'string' || !item.label.trim()) {
      console.error(`Proof invalid. items[${index}] must contain a non-empty label.`);
      process.exit(1);
    }
    if (!['pending', 'done'].includes(item.status)) {
      console.error(`Proof invalid. items[${index}] has unsupported status: ${item.status}`);
      process.exit(1);
    }
  }
}

if (proof.status === 'validated') {
  if (!Array.isArray(proof.items) || proof.items.length === 0) {
    console.error('Proof invalid. A validated proof should contain at least one item.');
    process.exit(1);
  }
  const allDone = proof.items.every((item) => item.status === 'done');
  if (!allDone) {
    console.error('Proof invalid. All items must be done before validation.');
    process.exit(1);
  }
}

console.log(`Proof OK: ${proof.id}`);
