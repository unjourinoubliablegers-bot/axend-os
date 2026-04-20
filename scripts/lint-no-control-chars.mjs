import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const exts = new Set(['.md','.txt','.ps1','.json','.ts','.tsx','.mjs','.toml','.yml','.yaml','.css','.html','.example']);
const failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'target') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name)) || entry.name === '.gitignore' || entry.name === 'README.md') {
      const text = fs.readFileSync(full, 'utf-8');
      for (let i = 0; i < text.length; i += 1) {
        const code = text.charCodeAt(i);
        if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
          failures.push(`${path.relative(root, full)} -> control char U+${code.toString(16).padStart(4, '0')}`);
          break;
        }
      }
    }
  }
}

walk(root);
if (failures.length) {
  console.error('Control characters found:');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}
console.log('No forbidden control characters found.');
