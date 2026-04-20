import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const core = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/project-core.json'), 'utf-8'));
const lot = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/current-lot.json'), 'utf-8'));
const status = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/project-status.json'), 'utf-8'));
const proofLog = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/proof-log.json'), 'utf-8'));
const latestProof = proofLog.entries?.[proofLog.entries.length - 1];
const bullets = (items = []) => items.map((item) => `- ${item}`).join('\n');

const content = `# RESTART PACK

## Projet
${core.projectName}

## Mission
${core.mission}

## Lot actif
${lot.lotId} — ${lot.title}

## Etat du lot
${lot.status}

## Prochaine action
${lot.nextAction}

## Blocage
${lot.blocker || 'Aucun blocage déclaré'}

## Dernière preuve
${latestProof ? `${latestProof.summary} (${latestProof.status})` : 'Aucune'}

## Statut projet
- Phase : ${status.phase}
- Milestone : ${status.nextMilestone}
- Dernière validation : ${status.lastValidatedProofAt || 'Aucune'}

## Definition of Done
${bullets(lot.definitionOfDone || [])}
`;

fs.writeFileSync(path.join(root, 'axend/handoffs/RESTART_PACK.md'), content);
console.log('RESTART_PACK.md generated.');
