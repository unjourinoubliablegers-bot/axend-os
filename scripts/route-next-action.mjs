import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lot = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/current-lot.json'), 'utf-8'));
const status = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/project-status.json'), 'utf-8'));
const proofLog = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/proof-log.json'), 'utf-8'));

const next = String(lot.nextAction || '').toLowerCase();
const blocker = String(lot.blocker || '').toLowerCase();
const files = Array.isArray(lot.filesInScope) ? lot.filesInScope.join(' ').toLowerCase() : '';
const latestProof = proofLog.entries?.[proofLog.entries.length - 1];

function hasAny(value, needles) {
  return needles.some((needle) => value.includes(needle));
}

let recommendedTool = 'chatgpt';
let confidence = 'medium';
let reason = 'Par défaut, AXEND envoie le cadrage ambigu vers ChatGPT.';

if (status.currentLotStatus === 'validated') {
  recommendedTool = 'chatgpt';
  confidence = 'high';
  reason = 'Le lot est validé : il faut cadrer le lot suivant ou fermer proprement le cycle.';
} else if (blocker) {
  if (hasAny(blocker, ['build', 'type', 'typescript', 'rust', 'tauri', 'erreur', 'bug', 'sql', 'sqlite'])) {
    recommendedTool = 'cursor';
    confidence = 'high';
    reason = 'Blocage technique détecté : priorité à Cursor pour lire, corriger et tester.';
  } else {
    recommendedTool = 'chatgpt';
    confidence = 'medium';
    reason = 'Blocage de cadrage ou de décision : ChatGPT aide à clarifier et trancher.';
  }
} else if (hasAny(next + ' ' + files, ['handoff', 'restart', 'synthèse', 'résumé', 'resume'])) {
  recommendedTool = 'ollama';
  confidence = 'high';
  reason = 'La tâche relève d’un résumé ou d’un handoff local.';
} else if (hasAny(next + ' ' + files, ['component', 'page', 'route', 'fix', 'bug', 'store', 'build', 'test', '.tsx', '.ts', '.rs', '.json'])) {
  recommendedTool = 'cursor';
  confidence = 'high';
  reason = 'La prochaine action touche directement au repo ou au code.';
} else if (latestProof && latestProof.status === 'pending') {
  recommendedTool = 'cursor';
  confidence = 'medium';
  reason = 'Une preuve est en attente : il faut probablement produire ou vérifier un résultat concret.';
}

console.log(JSON.stringify({
  nextAction: lot.nextAction,
  currentLotStatus: status.currentLotStatus,
  blocker: lot.blocker,
  filesInScope: lot.filesInScope,
  recommendedTool,
  confidence,
  reason
}, null, 2));
