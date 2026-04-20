import { useEffect, useMemo, useState } from 'react';
import { Panel, Badge } from './components';
import { loadAppState, loadRestartPack, persistAppState, persistRestartPack } from './lib/storage';
import { seedCurrentLot, seedProjectCore, seedProjectStatus, seedProofLog } from './seed';
import type { CurrentLot, ProjectCore, ProjectStatus, ProofLog } from './types';

const EMPTY_RESTART = `Etat fiable : starter runnable présent.
Ce qui reste : installer, vérifier, lancer, commencer le vrai lot.
Attention : ne pas ouvrir un autre lot avant preuve.`;

function buildRestartPack(projectName: string, lotTitle: string, nextAction: string, blocker: string, lastValidatedProofAt: string | null) {
  return [
    `# RESTART PACK`,
    ``,
    `Projet : ${projectName}`,
    `Lot actif : ${lotTitle}`,
    `Prochaine action : ${nextAction}`,
    `Blocage : ${blocker || 'Aucun'}`,
    `Dernière preuve validée : ${lastValidatedProofAt ?? 'Aucune'}`,
    ``,
    `Règle : finir le lot actif avant d'ouvrir un autre front.`
  ].join('\n');
}

export default function App() {
  const [core, setCore] = useState<ProjectCore>(seedProjectCore);
  const [status, setStatus] = useState<ProjectStatus>(seedProjectStatus);
  const [lot, setLot] = useState<CurrentLot>(seedCurrentLot);
  const [proof, setProof] = useState<ProofLog>(seedProofLog);
  const [restartPack, setRestartPack] = useState(EMPTY_RESTART);
  const [storageMode, setStorageMode] = useState<'loading' | 'tauri' | 'browser'>('loading');
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [loaded, restart] = await Promise.all([
        loadAppState(),
        loadRestartPack(EMPTY_RESTART)
      ]);
      if (cancelled) return;
      setCore(loaded.snapshot.core);
      setStatus(loaded.snapshot.status);
      setLot(loaded.snapshot.lot);
      setProof(loaded.snapshot.proof);
      setRestartPack(restart);
      setStorageMode(loaded.mode);
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timer = window.setTimeout(() => {
      void Promise.all([
        persistAppState({ core, status, lot, proof }),
        persistRestartPack(restartPack)
      ]).then(() => {
        setLastSavedAt(new Date().toISOString());
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [hydrated, core, status, lot, proof, restartPack]);

  useEffect(() => {
    if (!hydrated) return;
    const autoPack = buildRestartPack(core.projectName, lot.title, lot.nextAction, lot.blocker, status.lastValidatedProofAt);
    setRestartPack((prev) => prev === EMPTY_RESTART || prev.startsWith('# RESTART PACK') ? autoPack : prev);
  }, [hydrated, core.projectName, lot.title, lot.nextAction, lot.blocker, status.lastValidatedProofAt]);

  const health = useMemo(() => {
    let score = 0;
    if (lot.goal.trim()) score += 1;
    if (lot.nextAction.trim()) score += 1;
    if (lot.definitionOfDone.length > 0) score += 1;
    if (lot.proofExpected.length > 0) score += 1;
    if (!lot.blocker.trim()) score += 1;
    return score;
  }, [lot]);

  const latestProof = proof.entries[proof.entries.length - 1];

  function updateLot(field: keyof CurrentLot, value: string) {
    setLot((prev) => ({ ...prev, [field]: value }));
    if (field === 'blocker') {
      setStatus((prev) => ({
        ...prev,
        currentLotStatus: value.trim() ? 'blocked' : prev.currentLotStatus === 'blocked' ? 'in_progress' : prev.currentLotStatus
      }));
    }
  }

  function addProof() {
    const id = `proof-${Date.now()}`;
    setProof((prev) => ({
      entries: [
        ...prev.entries,
        {
          id,
          lotId: lot.lotId,
          kind: 'manual',
          status: 'pending',
          path: `axend/proofs/${id}.json`,
          summary: `Preuve ajoutée pour ${lot.title}`,
          createdAt: new Date().toISOString(),
          items: lot.proofExpected.map((item) => ({ label: item, status: 'done' as const }))
        }
      ]
    }));
    setLot((prev) => ({ ...prev, status: 'ready_for_validation' }));
    setStatus((prev) => ({ ...prev, currentLotStatus: 'ready_for_validation' }));
  }

  function markLatestValidated() {
    if (!proof.entries.length) return;
    const validatedAt = new Date().toISOString();
    setProof((prev) => ({
      entries: prev.entries.map((entry, index) =>
        index === prev.entries.length - 1
          ? {
              ...entry,
              status: 'validated',
              validatedAt,
              items: entry.items && entry.items.length > 0
                ? entry.items.map((item) => ({ ...item, status: 'done' as const }))
                : [{ label: 'Validation manuelle effectuée depuis l’interface', status: 'done' as const }]
            }
          : entry
      )
    }));
    setLot((prev) => ({ ...prev, status: 'validated', blocker: '' }));
    setStatus((prev) => ({
      ...prev,
      lastValidatedProofAt: validatedAt,
      currentLotStatus: 'validated'
    }));
  }

  function resetToSeed() {
    setCore(seedProjectCore);
    setStatus(seedProjectStatus);
    setLot(seedCurrentLot);
    setProof(seedProofLog);
    setRestartPack(EMPTY_RESTART);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AXEND OS</p>
          <h1>{core.projectName}</h1>
          <p className="hero-text">{core.mission}</p>
        </div>
        <div className="hero-side">
          <div className="metric">
            <span>Santé lot</span>
            <strong>{health}/5</strong>
          </div>
          <div className="metric">
            <span>Statut</span>
            <Badge value={status.currentLotStatus} />
          </div>
          <div className="metric">
            <span>Stockage</span>
            <strong>{storageMode === 'loading' ? 'chargement' : storageMode}</strong>
          </div>
          <button className="secondary" onClick={resetToSeed}>Revenir aux seeds</button>
        </div>
      </header>

      <main className="grid">
        <Panel title="Resume" subtitle="Vision instantanée du projet">
          <div className="field">
            <label>Objectif principal</label>
            <textarea value={core.primaryObjective} onChange={(e) => setCore({ ...core, primaryObjective: e.target.value })} />
          </div>
          <div className="field">
            <label>Utilisateur cible</label>
            <textarea value={core.targetUser} onChange={(e) => setCore({ ...core, targetUser: e.target.value })} />
          </div>
          <ul className="clean-list">
            <li><strong>Phase :</strong> {status.phase}</li>
            <li><strong>Lot actif :</strong> {status.currentLotId}</li>
            <li><strong>Prochaine action :</strong> {lot.nextAction}</li>
            <li><strong>Dernière preuve validée :</strong> {status.lastValidatedProofAt ?? 'Aucune'}</li>
            <li><strong>Dernière sauvegarde :</strong> {lastSavedAt ?? 'Pas encore'}</li>
          </ul>
        </Panel>

        <Panel title="Lot actif" subtitle="Un seul lot, un seul cap">
          <div className="field">
            <label>Titre lot</label>
            <input value={lot.title} onChange={(e) => updateLot('title', e.target.value)} />
          </div>
          <div className="field">
            <label>Objectif du lot</label>
            <textarea value={lot.goal} onChange={(e) => updateLot('goal', e.target.value)} />
          </div>
          <div className="field">
            <label>Prochaine action</label>
            <textarea value={lot.nextAction} onChange={(e) => updateLot('nextAction', e.target.value)} />
          </div>
          <div className="field">
            <label>Blocage</label>
            <textarea value={lot.blocker} onChange={(e) => updateLot('blocker', e.target.value)} />
          </div>
          <div className="chip-wrap">
            {lot.filesInScope.map((file) => <span key={file} className="chip">{file}</span>)}
          </div>
        </Panel>

        <Panel title="Definition of Done" subtitle="Le lot n'est pas fini sans critères clairs">
          <ol className="clean-list">
            {lot.definitionOfDone.map((item) => <li key={item}>{item}</li>)}
          </ol>
          <ol className="clean-list">
            {lot.proofExpected.map((item) => <li key={item}><strong>Preuve :</strong> {item}</li>)}
          </ol>
        </Panel>

        <Panel title="Preuves" subtitle="Fin du faux avancement">
          <div className="button-row">
            <button onClick={addProof}>Ajouter une preuve</button>
            <button className="secondary" onClick={markLatestValidated}>Valider la dernière preuve</button>
          </div>
          <ul className="clean-list">
            {proof.entries.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.summary}</strong><br />
                <small>{entry.path}</small><br />
                <Badge value={entry.status} />
                {entry.items && entry.items.length > 0 ? (
                  <ul className="clean-list nested">
                    {entry.items.map((item) => <li key={`${entry.id}-${item.label}`}>{item.label} — {item.status}</li>)}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          {latestProof ? <p className="small">Dernière preuve : {latestProof.id}</p> : null}
        </Panel>

        <Panel title="Restart Pack" subtitle="Reprise rapide">
          <div className="restart-box">
            <textarea value={restartPack} onChange={(e) => setRestartPack(e.target.value)} rows={10} />
            <p><strong>Reprendre maintenant :</strong> {lot.nextAction}</p>
          </div>
        </Panel>

        <Panel title="Connexions outils" subtitle="Qui fait quoi dans le stack">
          <ul className="clean-list">
            <li><strong>ChatGPT :</strong> cadrage, arbitrage, lot, décision</li>
            <li><strong>Cursor :</strong> édition, intégration, correction</li>
            <li><strong>Ollama :</strong> résumés, handoffs, brouillons locaux</li>
            <li><strong>Git/GitHub :</strong> vérité du code et historique</li>
            <li><strong>AXEND :</strong> cap, lot, preuve, reprise</li>
          </ul>
        </Panel>
      </main>
    </div>
  );
}
