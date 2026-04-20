import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

for (const relative of [
  'axend/state/project-core.json',
  'axend/state/project-status.json',
  'axend/state/current-lot.json',
  'axend/state/proof-log.json',
  'axend/proofs/latest-proof.json'
]) {
  test(`JSON valid -> ${relative}`, () => {
    const raw = fs.readFileSync(path.join(root, relative), 'utf-8');
    assert.doesNotThrow(() => JSON.parse(raw));
  });
}
