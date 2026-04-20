import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
for (const dir of ['axend/state', 'axend/handoffs', 'axend/proofs', 'axend/backups', 'docs', 'src', 'src-tauri']) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}
const proofPath = path.join(root, 'axend/proofs/latest-proof.json');
if (!fs.existsSync(proofPath)) {
  fs.writeFileSync(proofPath, JSON.stringify({
    id: 'proof-seed-001',
    lotId: 'LOT-00',
    kind: 'seed',
    status: 'pending',
    path: 'axend/proofs/latest-proof.json',
    summary: 'Ajouter ici la première preuve réelle.',
    createdAt: new Date().toISOString(),
    items: [{ label: 'Déposer une première preuve réelle', status: 'pending' }]
  }, null, 2));
}
for (const md of ['RESTART_PACK.md', 'HANDOFF_CURRENT.md']) {
  const target = path.join(root, 'axend/handoffs', md);
  if (!fs.existsSync(target)) fs.writeFileSync(target, `# ${md.replace('.md', '')}
`);
}
console.log('AXEND repo initialized.');
