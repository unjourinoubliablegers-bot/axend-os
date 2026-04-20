import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lot = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/current-lot.json'), 'utf-8'));
const proofLog = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/proof-log.json'), 'utf-8'));
const latestProof = proofLog.entries?.[proofLog.entries.length - 1];
const bullets = (items = []) => items.map((item) => `- ${item}`).join('\n');

const content = `# HANDOFF CURRENT

## Lot
${lot.lotId} — ${lot.title}

## Statut
${lot.status}

## Objectif
${lot.goal}

## Prochaine action
${lot.nextAction}

## Blocage
${lot.blocker || 'Aucun blocage déclaré'}

## Preuve attendue
${bullets(lot.proofExpected || [])}

## Dernière preuve connue
${latestProof ? `- ${latestProof.summary} (${latestProof.status})` : '- Aucune'}

## Fichiers dans le scope
${bullets(lot.filesInScope || [])}
`;

fs.writeFileSync(path.join(root, 'axend/handoffs/HANDOFF_CURRENT.md'), content);
console.log('HANDOFF_CURRENT.md generated.');
