import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const commands = [
  ['node', ['scripts/lint-no-control-chars.mjs']],
  ['node', ['scripts/validate-state.mjs']],
  ['node', ['scripts/generate-handoff.mjs']],
  ['node', ['scripts/generate-restart-pack.mjs']],
  ['node', ['scripts/validate-proof.mjs']]
];

for (const [cmd, args] of commands) {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf-8', shell: process.platform === 'win32' });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.status !== 0) process.exit(result.status || 1);
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'axend-lot-validation-'));
for (const dir of ['axend/proofs', 'axend/state']) {
  fs.mkdirSync(path.join(temp, dir), { recursive: true });
}
fs.writeFileSync(path.join(temp, 'axend/proofs/latest-proof.json'), JSON.stringify({
  id: 'proof-test-001',
  lotId: 'LOT-TEST',
  kind: 'manual',
  status: 'pending',
  summary: 'Smoke validation proof',
  items: [{ label: 'Build OK', status: 'done' }]
}, null, 2));
fs.writeFileSync(path.join(temp, 'axend/state/proof-log.json'), JSON.stringify({ entries: [] }, null, 2));
fs.writeFileSync(path.join(temp, 'axend/state/current-lot.json'), JSON.stringify({
  lotId: 'LOT-TEST',
  title: 'Smoke lot',
  goal: 'Valider le cycle lot → preuve',
  definitionOfDone: ['Une preuve valide existe'],
  status: 'ready_for_validation',
  nextAction: 'Valider le lot',
  proofExpected: ['Build OK'],
  blocker: '',
  filesInScope: ['src/App.tsx']
}, null, 2));
fs.writeFileSync(path.join(temp, 'axend/state/project-status.json'), JSON.stringify({
  phase: 'smoke',
  currentLotId: 'LOT-TEST',
  currentLotStatus: 'ready_for_validation',
  nextMilestone: 'Smoke lot validation',
  lastValidatedProofAt: null
}, null, 2));

const lotValidation = spawnSync('node', [path.join(root, 'scripts/complete-lot-validation.mjs')], {
  cwd: temp,
  encoding: 'utf-8',
  shell: process.platform === 'win32'
});
process.stdout.write(lotValidation.stdout || '');
process.stderr.write(lotValidation.stderr || '');
if (lotValidation.status !== 0) process.exit(lotValidation.status || 1);

console.log('AXEND smoke tests OK');
