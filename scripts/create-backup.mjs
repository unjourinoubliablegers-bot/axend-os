import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(root, 'axend', 'backups', stamp);
fs.mkdirSync(backupDir, { recursive: true });
for (const relative of ['axend/state', 'axend/handoffs', 'axend/proofs']) {
  const src = path.join(root, relative);
  const dst = path.join(backupDir, path.basename(relative));
  fs.cpSync(src, dst, { recursive: true });
}
console.log(`Backup created: ${backupDir}`);
