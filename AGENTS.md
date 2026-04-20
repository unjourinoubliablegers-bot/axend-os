# AXEND AGENTS RULES

## Mission
Construire AXEND OS sans dispersion. Un lot actif à la fois.

## Règles absolues
1. Toujours lire `axend/state/current-lot.json` avant de modifier du code.
2. Une seule prochaine action à la fois.
3. Pas de nouveau lot tant qu'une preuve valide n'existe pas.
4. Toujours mettre à jour `RESTART_PACK.md` en fin de session importante.
5. Toujours préférer la solution la plus simple qui fonctionne.

## Vérifications minimales
- `pnpm axend:doctor`
- `pnpm type-check`
- `pnpm build`
