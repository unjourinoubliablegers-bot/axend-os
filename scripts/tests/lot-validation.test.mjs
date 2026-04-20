import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, 'scripts/complete-lot-validation.mjs');

function seedFixture(base, proof) {
  for (const dir of ['axend/proofs', 'axend/state']) {
    fs.mkdirSync(path.join(base, dir), { recursive: true });
  }
  fs.writeFileSync(path.join(base, 'axend/proofs/latest-proof.json'), JSON.stringify(proof, null, 2));
  fs.writeFileSync(path.join(base, 'axend/state/proof-log.json'), JSON.stringify({ entries: [] }, null, 2));
  fs.writeFileSync(path.join(base, 'axend/state/current-lot.json'), JSON.stringify({
    lotId: 'LOT-T',
    title: 'Fixture lot',
    goal: 'Tester la validation',
    definitionOfDone: ['Une preuve'],
    status: 'ready_for_validation',
    nextAction: 'Valider',
    proofExpected: ['Build OK'],
    blocker: '',
    filesInScope: ['src/App.tsx']
  }, null, 2));
  fs.writeFileSync(path.join(base, 'axend/state/project-status.json'), JSON.stringify({
    phase: 'tests',
    currentLotId: 'LOT-T',
    currentLotStatus: 'ready_for_validation',
    nextMilestone: 'Validation',
    lastValidatedProofAt: null
  }, null, 2));
}

test('complete-lot-validation rejects proof without items', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'axend-proof-invalid-'));
  seedFixture(temp, {
    id: 'proof-invalid',
    lotId: 'LOT-T',
    kind: 'manual',
    status: 'pending',
    summary: 'Invalid proof',
    items: []
  });

  const result = spawnSync('node', [scriptPath], { cwd: temp, encoding: 'utf-8', shell: process.platform === 'win32' });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}
${result.stderr}`, /at least one proof item/i);
});

test('complete-lot-validation validates a correct proof', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'axend-proof-valid-'));
  seedFixture(temp, {
    id: 'proof-valid',
    lotId: 'LOT-T',
    kind: 'manual',
    status: 'pending',
    summary: 'Valid proof',
    items: [{ label: 'Build OK', status: 'done' }]
  });

  const result = spawnSync('node', [scriptPath], { cwd: temp, encoding: 'utf-8', shell: process.platform === 'win32' });
  assert.equal(result.status, 0);

  const status = JSON.parse(fs.readFileSync(path.join(temp, 'axend/state/project-status.json'), 'utf-8'));
  const proof = JSON.parse(fs.readFileSync(path.join(temp, 'axend/proofs/latest-proof.json'), 'utf-8'));
  assert.equal(status.currentLotStatus, 'validated');
  assert.equal(proof.status, 'validated');
  assert.ok(proof.validatedAt);
});
