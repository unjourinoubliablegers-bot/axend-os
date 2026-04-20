# AXEND OS — Runnable Starter V8 Finalized

Ce dossier est une base applicative **runnable** pour AXEND, avec :
- UI React + TypeScript + Vite
- backend Tauri minimal
- persistance **locale réelle sur desktop via Tauri**
- fallback **localStorage** côté web
- scripts doctor / init / restart / handoff / proof / validation lot / Ollama
- méthode **low-token** visible et intégrée
- cycle **lot → preuve → validation** contrôlé par scripts et tests

## Démarrage rapide
```powershell
corepack enable
pnpm install
pnpm axend:init
pnpm axend:doctor
```

### Desktop Tauri
```powershell
pnpm tauri:dev
```

### Web fallback
```powershell
pnpm dev
```

## Ce que contient ce starter
- états AXEND structurés
- routeur d’outils et handoffs
- cycle lot → preuve → validation
- persistance desktop locale dans le dossier applicatif Tauri
- prompts locaux Ollama
- lint / syntax TS / tests / smoke sans dépendance externe additionnelle
- restart pack éditable et persisté

## Vérité actuelle du starter
Ce starter **n’est pas encore AXEND complet**.
C’est un **noyau runnable solide** pour démarrer proprement.
La persistance desktop écrit dans le dossier applicatif local Tauri.
La version web utilise un fallback localStorage.
Le premier verdict final dépend encore du premier run réel `pnpm install` + `pnpm build` + `pnpm tauri:dev` sur ton PC Windows 11 Pro.

## Réalité honnête
Ce pack est conçu pour limiter les manques hors exécution réelle. La validation finale Windows/Rust/Tauri/Ollama reste un passage terrain obligatoire.

## Méthode low-token à lire en premier
`docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md`

## Chemin machine recommandé
`C:\AXEND\05_Projects\axend-os`

## Scripts utiles
```powershell
pnpm axend:init
pnpm axend:doctor
pnpm lint
pnpm format:check
pnpm test
pnpm axend:restart
pnpm axend:handoff
pnpm axend:proof
pnpm axend:validate-lot
pnpm axend:next
pnpm axend:ollama:restart
pnpm axend:ollama:next
pnpm axend:backup
pnpm check:all
```
