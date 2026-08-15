# Puissance 4

Application web "Puissance 4" — jeu classique en 2 joueurs développé en JavaScript, HTML et CSS.

## Description

- Interface : canvas HTML5 pour le plateau, rendu graphique des jetons.
- Logique du jeu : objet `Game` gère l'état du plateau, les règles, détection du gagnant, annulation (undo) et historique simple.
- Contrôles : bouton **Nouvelle partie** (reset). Le design a été récemment refondu pour une interface moderne (nouveau `index.html` et styles).

> Note : le dépôt contient une version cliente (frontend) statique. Aucun backend nécessaire.

## Structure du dépôt

- `index.html` — page principale (UI + contrôles).
- `style.css` — styles et thème.
- `script.js` — logique du jeu et rendu sur canvas.

## Lancer le projet

Méthode simple (double-cliquer) :
1. Ouvrez `index.html` dans votre navigateur (Chrome, Firefox, Edge, ...).

Méthode recommandée (server local, évite certains problèmes de CORS si vous ajoutez des ressources) :

- Avec Python 3 :

  ```bash
  # depuis la racine du dépôt
  python3 -m http.server 8000
  # puis ouvrez http://localhost:8000
  ```

- Avec Node.js (http-server) :

  ```bash
  npm install -g http-server
  http-server -p 8000
  # puis ouvrez http://localhost:8000
  ```

## Utilisation

- Cliquez sur une colonne du plateau pour déposer un jeton pour le joueur courant.
- Le jeu alterne entre `🔴 Rouge` et `🟡 Jaune`.
- Cliquez sur **Nouvelle partie** pour recommencer.

## Ajout / activation d'une IA (Minimax)

- Le dépôt contient actuellement la logique de jeu pour une partie locale à 2 joueurs. Dans la conversation liée à ce dépôt, une version de `script.js` avec un algorithme Minimax (avec élagage alpha‑beta et profondeur configurable) a été proposée, ainsi qu'une option d'interface (`ai-toggle`, `ai-depth`) et un mode pour jouer contre l'ordinateur.

- Si vous souhaitez intégrer l'IA maintenant, je peux :
  - remplacer `script.js` par la version Minimax (prise en charge du toggle IA et du choix de profondeur), ou
  - créer une branche `feat/minimax` et ouvrir une Pull Request pour revue.

Dites-moi ce que vous préférez et j'appliquerai la modification.

## Contribution

- Forkez le dépôt, créez une branche feature, apportez vos modifications puis créez une Pull Request.
- Tests manuels recommandés après modifications : vérifier la détection de victoire, l'annulation (undo), le comportement du reset, et (si IA ajoutée) tester plusieurs profondeurs (`3`, `5`, `7`) pour évaluer latence et qualité.

## Améliorations suggérées

- Exécuter l'IA dans un Web Worker pour éviter de bloquer l'UI à grandes profondeurs.
- Ajouter des animations d'insertion de jetons (requestAnimationFrame).
- Améliorer l'accessibilité : labels, navigation clavier, rôles ARIA.
- Ajouter tests automatisés pour la logique (jest ou autre).

## Licence

- Aucune licence explicite fournie. Ajoutez un fichier `LICENSE` si vous souhaitez préciser les droits d'utilisation.

---

Si vous voulez que j'ajoute la version Minimax de `script.js` et/ou que je complète le style (nouveau `style.css`), dites simplement : "Oui, remplace script.js" ou "Crée une branche feat/minimax et pousse les modifications" et je m'en occupe.