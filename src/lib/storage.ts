import type { AppStateSnapshot, CurrentLot, ProjectCore, ProjectStatus, ProofEntry, ProofLog } from '../types';
import { seedCurrentLot, seedProjectCore, seedProjectStatus, seedProofLog } from '../seed';

type StorageMode = 'tauri' | 'browser';
type JsonArea = 'state' | 'proofs';
type TextArea = 'handoffs';
type InvokeFn = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

const K_CORE = 'axend.projectCore';
const K_STATUS = 'axend.projectStatus';
const K_LOT = 'axend.currentLot';
const K_PROOF = 'axend.proofLog';
const K_LATEST_PROOF = 'axend.latestProof';
const K_RESTART = 'axend.restartPack';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

async function getInvoke(): Promise<InvokeFn | null> {
  if (typeof window === 'undefined') return null;
  const marker = '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
  if (!marker) return null;

  try {
    const mod = await import('@tauri-apps/api/core');
    return mod.invoke as InvokeFn;
  } catch {
    return null;
  }
}

async function loadJsonDocument<T>(area: JsonArea, name: string, fallback: T): Promise<T> {
  const invoke = await getInvoke();
  if (!invoke) {
    return readLocal(`${area}.${name}`, fallback);
  }

  try {
    return await invoke<T>('load_json_document', { area, name, fallback });
  } catch {
    return readLocal(`${area}.${name}`, fallback);
  }
}

async function saveJsonDocument<T>(area: JsonArea, name: string, value: T): Promise<void> {
  const invoke = await getInvoke();
  if (!invoke) {
    writeLocal(`${area}.${name}`, value);
    return;
  }

  try {
    await invoke<string>('save_json_document', { area, name, value });
  } catch {
    writeLocal(`${area}.${name}`, value);
  }
}

async function loadTextDocument(area: TextArea, name: string, fallback: string): Promise<string> {
  const invoke = await getInvoke();
  if (!invoke) {
    return readLocal(`${area}.${name}`, fallback);
  }

  try {
    return await invoke<string>('read_text_document', { area, name, fallback });
  } catch {
    return readLocal(`${area}.${name}`, fallback);
  }
}

async function saveTextDocument(area: TextArea, name: string, content: string): Promise<void> {
  const invoke = await getInvoke();
  if (!invoke) {
    writeLocal(`${area}.${name}`, content);
    return;
  }

  try {
    await invoke<string>('write_text_document', { area, name, content });
  } catch {
    writeLocal(`${area}.${name}`, content);
  }
}

function latestProofFromLog(proof: ProofLog): ProofEntry {
  return (
    proof.entries[proof.entries.length - 1] ?? {
      id: 'proof-seed-001',
      lotId: 'LOT-00',
      kind: 'seed',
      status: 'pending',
      path: 'axend/proofs/latest-proof.json',
      summary: 'Ajouter ici la première preuve réelle',
      items: [{ label: 'Déposer une première preuve réelle', status: 'pending' }]
    }
  );
}

export async function loadAppState(): Promise<{ mode: StorageMode; snapshot: AppStateSnapshot }> {
  const invoke = await getInvoke();
  const mode: StorageMode = invoke ? 'tauri' : 'browser';

  if (!invoke) {
    const core = readLocal(K_CORE, seedProjectCore);
    const status = readLocal(K_STATUS, seedProjectStatus);
    const lot = readLocal(K_LOT, seedCurrentLot);
    const proof = readLocal(K_PROOF, seedProofLog);
    return { mode, snapshot: { core, status, lot, proof } };
  }

  const [core, status, lot, proof] = await Promise.all([
    loadJsonDocument<ProjectCore>('state', 'project-core', seedProjectCore),
    loadJsonDocument<ProjectStatus>('state', 'project-status', seedProjectStatus),
    loadJsonDocument<CurrentLot>('state', 'current-lot', seedCurrentLot),
    loadJsonDocument<ProofLog>('state', 'proof-log', seedProofLog)
  ]);

  return { mode, snapshot: { core, status, lot, proof } };
}

export async function persistAppState(snapshot: AppStateSnapshot): Promise<void> {
  const latestProof = latestProofFromLog(snapshot.proof);
  await Promise.all([
    saveJsonDocument('state', 'project-core', snapshot.core),
    saveJsonDocument('state', 'project-status', snapshot.status),
    saveJsonDocument('state', 'current-lot', snapshot.lot),
    saveJsonDocument('state', 'proof-log', snapshot.proof),
    saveJsonDocument('proofs', 'latest-proof', latestProof)
  ]);

  if (typeof window !== 'undefined') {
    writeLocal(K_CORE, snapshot.core);
    writeLocal(K_STATUS, snapshot.status);
    writeLocal(K_LOT, snapshot.lot);
    writeLocal(K_PROOF, snapshot.proof);
    writeLocal(K_LATEST_PROOF, latestProof);
  }
}

export async function loadRestartPack(fallback: string): Promise<string> {
  return loadTextDocument('handoffs', 'RESTART_PACK', fallback);
}

export async function persistRestartPack(content: string): Promise<void> {
  await saveTextDocument('handoffs', 'RESTART_PACK', content);
  if (typeof window !== 'undefined') {
    writeLocal(K_RESTART, content);
  }
}
