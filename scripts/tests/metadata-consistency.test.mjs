import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('README and package metadata are aligned to V8', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf-8');
  assert.equal(pkg.version, '0.8.0');
  assert.match(pkg.description, /v8 finalized/i);
  assert.match(readme, /V8 Finalized/);
});
