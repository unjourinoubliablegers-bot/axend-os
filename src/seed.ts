import projectCore from '../axend/state/project-core.json';
import projectStatus from '../axend/state/project-status.json';
import currentLot from '../axend/state/current-lot.json';
import proofLog from '../axend/state/proof-log.json';

import type { ProjectCore, ProjectStatus, CurrentLot, ProofLog } from './types';

export const seedProjectCore = projectCore as ProjectCore;
export const seedProjectStatus = projectStatus as ProjectStatus;
export const seedCurrentLot = currentLot as CurrentLot;
export const seedProofLog = proofLog as ProofLog;
