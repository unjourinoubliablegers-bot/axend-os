# AXEND LOW-TOKEN METHOD — 1 PAGE

## Règle centrale
AXEND ne doit envoyer **que le contexte utile maintenant**.

## Les 10 règles
1. **Un seul projet actif.**
2. **Un seul lot actif.**
3. **Une seule prochaine action.**
4. **Pas d’historique complet recollé par défaut.**
5. **Toujours préférer des fichiers d’état courts** plutôt que des longs textes.
6. **ChatGPT** pour arbitrer et cadrer.
7. **Cursor** pour lire, modifier, tester et intégrer dans le repo.
8. **Ollama/Qwen** pour résumés, handoffs, brouillons et suggestions locales.
9. **Une preuve obligatoire** pour fermer un lot.
10. **Un restart pack court** pour reprendre vite.

## Les fichiers de vérité
- `axend/state/project-core.json`
- `axend/state/project-status.json`
- `axend/state/current-lot.json`
- `axend/state/proof-log.json`
- `axend/proofs/latest-proof.json`
- `axend/handoffs/HANDOFF_CURRENT.md`
- `axend/handoffs/RESTART_PACK.md`

## Routage outil
- **ChatGPT** : cadrage, arbitrage, découpage de lots, décisions de cap.
- **Cursor** : édition, intégration, correction, tests, build.
- **Ollama** : résumé local, restart pack, handoff, prochaine action locale.
- **Git/GitHub** : vérité du code, commits, historique.

## Ce qu’il ne faut jamais faire
- renvoyer tout le repo à chaque appel,
- ouvrir plusieurs lots actifs,
- valider sans preuve,
- garder des prompts romans,
- mélanger stratégie, build et résumé dans un seul appel.

## Formule AXEND
**Moins de contexte. Moins de bruit. Plus de lots terminés.**
