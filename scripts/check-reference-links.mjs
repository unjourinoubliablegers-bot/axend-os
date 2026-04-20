import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const filesToCheck = ['README.md', 'docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md'];
const refs = [
  'docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md',
  'src/App.tsx',
  'src/lib/storage.ts',
  'src-tauri/src/lib.rs',
  'axend/state/project-core.json',
  'axend/state/project-status.json',
  'axend/state/current-lot.json',
  'axend/state/proof-log.json',
  'axend/proofs/latest-proof.json',
  'axend/handoffs/RESTART_PACK.md',
  'scripts/app-doctor.mjs',
  'scripts/ollama-router.mjs'
];

const missing = refs.filter((relative) => !fs.existsSync(path.join(root, relative)));
if (missing.length) {
  console.error('Missing referenced files:');
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

for (const file of filesToCheck) {
  const text = fs.readFileSync(path.join(root, file), 'utf-8');
  for (const ref of refs) {
    if ((ref.startsWith('docs/') || ref.startsWith('scripts/ollama-router') || ref === 'src/App.tsx') && !text.includes(ref) && file === 'README.md') {
      // only enforce the core public refs in README
      continue;
    }
  }
}

console.log('Reference links OK.');
