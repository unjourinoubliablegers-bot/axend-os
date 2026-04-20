import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const root = process.cwd();
const targets = ['src', 'src-tauri'];
const exts = new Set(['.ts', '.tsx']);
const ignoreDirs = new Set(['node_modules', 'target', 'dist']);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

const files = targets.flatMap((dir) => walk(path.join(root, dir)));
let hadError = false;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const kind = file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const diags = sf.parseDiagnostics ?? [];
  if (!diags.length) continue;
  hadError = true;
  console.error(`Syntax errors in ${path.relative(root, file)}`);
  for (const d of diags) {
    const pos = d.start != null ? sf.getLineAndCharacterOfPosition(d.start) : null;
    const loc = pos ? `${pos.line + 1}:${pos.character + 1}` : '?:?';
    console.error(`  - ${loc} ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
  }
}

if (hadError) process.exit(1);
console.log(`TypeScript syntax OK (${files.length} files checked).`);
