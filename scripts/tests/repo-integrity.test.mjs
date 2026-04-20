import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

for (const relative of [
  'README.md',
  '.editorconfig',
  'src/App.tsx',
  'src/lib/storage.ts',
  'src-tauri/src/lib.rs',
  'docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md',
  'scripts/app-doctor.mjs',
  'scripts/ollama-router.mjs',
  'scripts/check-reference-links.mjs'
]) {
  test(`exists -> ${relative}`, () => {
    assert.equal(fs.existsSync(path.join(root, relative)), true);
  });
}
