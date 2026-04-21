import projectCore from '../axend/state/project-core.json';
import projectStatus from '../axend/state/project-status.json';
import currentLot from '../axend/state/current-lot.json';
import proofLog from '../axend/state/proof-log.json';

import type { ProjectCore, ProjectStatus, CurrentLot, ProofLog } from './types';

export const seedProjectCore = projectCore as ProjectCore;

export const seedProjectStatus: ProjectStatus = {
  ...(projectStatus as ProjectStatus),
  currentLotId: 'LOT-02',
  currentLotStatus: 'in_progress',
  currentValidatedProofId: null,
  currentLotCompletedAt: null,
  closedLots: []
};

export const seedCurrentLot: CurrentLot = {
  ...(currentLot as CurrentLot),
  lotId: 'LOT-02',
  title: 'Rendre les statuts de lot plus propres et plus utiles',
  goal: 'Avoir des statuts plus clairs, plus cohérents et plus pilotables dans AXEND',
  status: 'in_progress',
  nextAction: 'Vérifier que le statut reste persistant et cohérent dans l’interface',
  blocker: '',
  proofExpected: [
    'statut visible',
    'statut modifiable',
    'statut persisté'
  ],
  filesInScope: ['src/types.ts', 'src/App.tsx', 'src/styles.css']
};

export const seedProofLog = proofLog as ProofLog;
