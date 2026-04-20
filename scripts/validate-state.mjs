import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const specs = {
  'axend/state/project-core.json': ['projectName', 'mission', 'primaryObjective', 'stack', 'rules', 'targetUser'],
  'axend/state/project-status.json': ['phase', 'currentLotId', 'currentLotStatus', 'nextMilestone', 'lastValidatedProofAt'],
  'axend/state/current-lot.json': ['lotId', 'title', 'goal', 'definitionOfDone', 'status', 'nextAction', 'proofExpected', 'blocker', 'filesInScope'],
  'axend/state/proof-log.json': ['entries'],
  'axend/proofs/latest-proof.json': ['id', 'lotId', 'kind', 'status', 'summary']
};

let failed = false;
for (const [relative, keys] of Object.entries(specs)) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    console.error(`Missing file: ${relative}`);
    failed = true;
    continue;
  }
  try {
    const data = JSON.parse(fs.readFileSync(full, 'utf-8'));
    const missing = keys.filter((key) => !(key in data));
    if (missing.length) {
      console.error(`${relative} missing keys: ${missing.join(', ')}`);
      failed = true;
    }
  } catch (error) {
    console.error(`${relative} invalid JSON: ${error.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('AXEND state files valid.');
