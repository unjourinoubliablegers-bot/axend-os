import projectCore from '../axend/state/project-core.json';
import projectStatus from '../axend/state/project-status.json';
import currentLot from '../axend/state/current-lot.json';
import proofLog from '../axend/state/proof-log.json';

import type { ProjectCore, ProjectStatus, CurrentLot, ProofLog } from './types';

export const seedProjectCore = projectCore as ProjectCore;
export const seedProjectStatus = currentLotId: 'LOT-02',
currentLotStatus: 'in_progress',
export const seedCurrentLot = lotId: 'LOT-02',
title: 'Rendre les statuts de lot plus propres et plus utiles',
goal: 'Avoir des statuts plus clairs, plus cohérents et plus pilotables dans AXEND',
status: 'in_progress',
nextAction: 'Vérifier que le statut reste persistant et cohérent dans l’interface',
blocker: '',
export const seedProofLog = proofLog as ProofLog;
