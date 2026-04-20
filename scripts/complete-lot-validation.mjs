import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const proofPath = path.join(root, 'axend/proofs/latest-proof.json');
const proofLogPath = path.join(root, 'axend/state/proof-log.json');
const lotPath = path.join(root, 'axend/state/current-lot.json');
const statusPath = path.join(root, 'axend/state/project-status.json');

const proof = JSON.parse(fs.readFileSync(proofPath, 'utf-8'));
if (!proof.id || !proof.lotId || !proof.summary) {
  console.error('Cannot validate lot: latest-proof.json is incomplete.');
  process.exit(1);
}
if (!Array.isArray(proof.items) || proof.items.length === 0) {
  console.error('Cannot validate lot: latest proof must contain at least one proof item.');
  process.exit(1);
}
if (!proof.items.every((item) => item.status === 'done')) {
  console.error('Cannot validate lot: every proof item must be marked done.');
  process.exit(1);
}

proof.status = 'validated';
proof.validatedAt = new Date().toISOString();
fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));

const proofLog = JSON.parse(fs.readFileSync(proofLogPath, 'utf-8'));
proofLog.entries = (proofLog.entries || []).map((entry) =>
  entry.id === proof.id
    ? { ...entry, status: 'validated', items: proof.items, validatedAt: proof.validatedAt }
    : entry
);
if (!proofLog.entries.some((entry) => entry.id === proof.id)) {
  proofLog.entries.push({
    id: proof.id,
    lotId: proof.lotId,
    kind: proof.kind || 'manual',
    status: 'validated',
    path: 'axend/proofs/latest-proof.json',
    summary: proof.summary,
    createdAt: proof.validatedAt,
    validatedAt: proof.validatedAt,
    items: proof.items
  });
}
fs.writeFileSync(proofLogPath, JSON.stringify(proofLog, null, 2));

const lot = JSON.parse(fs.readFileSync(lotPath, 'utf-8'));
lot.status = 'validated';
lot.blocker = '';
fs.writeFileSync(lotPath, JSON.stringify(lot, null, 2));

const status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
status.currentLotStatus = 'validated';
status.lastValidatedProofAt = proof.validatedAt;
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));

console.log(`Lot ${lot.lotId} validated with proof ${proof.id}.`);
