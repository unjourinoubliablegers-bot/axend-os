import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const exts = new Set(['.md', '.txt', '.ps1', '.json', '.ts', '.tsx', '.mjs', '.toml', '.yml', '.yaml', '.css', '.html']);
let failed = false;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'target') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name)) || entry.name === '.gitignore') {
      const text = fs.readFileSync(full, 'utf-8');
      if (text.includes('\r\n')) {
        console.error(`CRLF found: ${path.relative(root, full)}`);
        failed = true;
      }
      if ((path.relative(root, full) === 'README.md' || path.relative(root, full).startsWith('docs/')) && text.includes('\\n##')) {
        console.error(`Suspicious escaped newlines found: ${path.relative(root, full)}`);
        failed = true;
      }
      if (!text.endsWith('\n')) {
        console.error(`Missing final newline: ${path.relative(root, full)}`);
        failed = true;
      }
    }
  }
}

walk(root);
if (failed) process.exit(1);
console.log('Format checks OK.');
