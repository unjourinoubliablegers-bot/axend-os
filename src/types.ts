export type LotStatus =
  | 'clear'
  | 'in_progress'
  | 'blocked'
  | 'ready_for_validation'
  | 'validated';

export type ClosedLotEntry = {
  lotId: string;
  title: string;
  status: LotStatus;
  closedAt: string | null;
  proofId: string | null;
  summary: string;
};

export type ProjectCore = {
  projectName: string;
  mission: string;
  primaryObjective: string;
  stack: string[];
  rules: string[];
  targetUser: string;
};

export type ProjectStatus = {
  phase: string;
  currentLotId: string;
  currentLotStatus: LotStatus;
  nextMilestone: string;
  lastValidatedProofAt: string | null;
  currentValidatedProofId: string | null;
  currentLotCompletedAt: string | null;
  closedLots: ClosedLotEntry[];
};

export type CurrentLot = {
  lotId: string;
  title: string;
  goal: string;
  definitionOfDone: string[];
  status: LotStatus;
  nextAction: string;
  proofExpected: string[];
  blocker: string;
  filesInScope: string[];
};

export type ProofStatus = 'pending' | 'validated' | 'rejected';

export type ProofItem = {
  label: string;
  status: 'pending' | 'done';
};

export type ProofEntry = {
  id: string;
  lotId: string;
  kind: string;
  status: ProofStatus;
  path: string;
  summary: string;
  createdAt?: string;
  validatedAt?: string;
  items?: ProofItem[];
};

export type ProofLog = {
  entries: ProofEntry[];
};

export type AppStateSnapshot = {
  core: ProjectCore;
  status: ProjectStatus;
  lot: CurrentLot;
  proof: ProofLog;
};
