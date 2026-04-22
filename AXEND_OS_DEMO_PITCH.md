# AXEND OS — Démo / pitch

## Démo 60 secondes

AXEND OS sert à reprendre un chantier sans repartir de zéro.
Ici, sur **Today**, je vois immédiatement le **lot actif** et la **prochaine action unique**.
Sur **Resume**, je retrouve en premier le **statut**, le **blocage**, la **prochaine action** et la **dernière sauvegarde**.
Donc après une coupure, je sais quoi faire sans relire tout le projet.
L’état reste en local après rechargement.
Aujourd’hui, la valeur est simple : **reprendre vite, rester clair, avancer sans dispersion**.

---

## Démo 5 minutes

### Minute 0 à 1 — ouverture

**À montrer à l’écran**
- l’app lancée en web ;
- l’écran **Today**.

**À dire**
- « Je te montre un système local-first déjà validé en web. »
- « Le but n’est pas de te montrer 20 fonctions. Le but est de te montrer comment reprendre vite et agir tout de suite. »
- « Sur cet écran, je vois immédiatement le lot actif et la prochaine action unique. »

### Minute 1 à 2 — Today

**À montrer à l’écran**
- le lot actif ;
- la prochaine action unique ;
- éventuellement une petite modification d’un champ si c’est stable.

**À dire**
- « Ici, la valeur est la clarté immédiate. »
- « Je n’ai pas besoin de retrouver dix notes ou cinq chats pour savoir quoi faire. »
- « AXEND force un seul lot actif et une seule prochaine action utile. »

### Minute 2 à 3 — Resume

**À montrer à l’écran**
- l’écran **Resume** ;
- en haut : lot actif, statut, prochaine action, blocage, dernière sauvegarde.

**À dire**
- « C’est l’écran de reprise. »
- « Après une coupure, je reviens ici et je récupère le contexte utile en premier. »
- « La valeur n’est pas la sophistication. La valeur est de redémarrer vite, proprement, sans dispersion. »

### Minute 3 à 4 — persistance locale + Copilot

**À montrer à l’écran**
- un rechargement simple de la page ;
- retour sur **Resume** ou **Today** ;
- l’espace **Copilot**.

**À dire**
- « L’état local reste après rechargement, donc la reprise ne dépend pas d’une mémoire fragile. »
- « Et ici, Copilot a sa place dédiée dans le shell. »
- « Je ne te promets pas autre chose que ce qui est validé : aujourd’hui, je montre un shell exécutable, clair et utile pour reprendre. »

### Minute 4 à 5 — preuve hors produit

**À montrer à l’écran**
- le journal de décisions : `axend/decisions/DECISIONS.md` ;
- la preuve minimale : `axend/proofs/latest-proof.json` et `axend/state/proof-log.json` ;
- le repo GitHub déjà poussé.

**À dire**
- « L’application n’est pas montrée seule : j’ai aussi la trace des décisions. »
- « J’ai une preuve minimale consignée de ce qui a été réellement lancé et observé. »
- « Et j’ai une sauvegarde distante propre sur GitHub. »
- « Donc je montre un système déjà exécutable, tracé et sauvegardé, sans ajouter de complexité produit. »

---

## Checklist technique de démo

### Quoi lancer avant
- lancer l’app en web avec `pnpm exec vite --host 127.0.0.1 --port 1421` ;
- ouvrir directement l’URL locale ;
- préparer l’écran **Today** au démarrage ;
- garder **Resume** prêt à afficher juste après.

### Quoi vérifier
- l’app s’ouvre bien en web ;
- **Today**, **Resume** et **Copilot** sont visibles ;
- sur **Resume**, lot actif, statut, prochaine action, blocage et dernière sauvegarde sont bien en premier ;
- un rechargement simple ne fait pas perdre l’état local ;
- les fichiers existent bien :
  - `axend/decisions/DECISIONS.md`
  - `axend/proofs/latest-proof.json`
  - `axend/state/proof-log.json`

### Quoi éviter
- ne pas improviser des fonctions non validées ;
- ne pas parler de backend, auth, Tauri, SQLite, MCP ou multi-agent ;
- ne pas transformer la démo en revue technique du repo ;
- ne pas ouvrir d’écrans ou de fichiers non préparés ;
- ne pas survendre **Copilot** au-delà de ce qui est réellement visible aujourd’hui.

### Plan B simple si un écran bloque
- d’abord : recharge la page ;
- ensuite : bascule immédiatement sur **Resume**, parce que c’est l’écran le plus dense pour la reprise ;
- si l’UI bloque encore : continue la démo hors produit avec `axend/decisions/DECISIONS.md`, puis `axend/proofs/latest-proof.json` ;
- garde le même message : « le système est déjà tracé, prouvé et sauvegardé, même si je ne prolonge pas la démo UI maintenant. »

---

## Limite actuelle à dire honnêtement

Aujourd’hui, AXEND OS est un **shell local-first exécutable en web**, centré sur la reprise rapide et la clarté d’exécution.
Ce n’est pas encore une plateforme complète avec backend, auth, sync avancée ou automatisation riche.
La valeur déjà réelle est ailleurs : **lot actif clair, prochaine action unique, reprise immédiate, décisions tracées, preuve minimale et sauvegarde propre**.
Je préfère montrer cela proprement maintenant plutôt que promettre des couches qui n’existent pas encore.
