# Boussole 2027 — pipeline de données

Alimente la page « Boussole 2027 » (artifact Claude) à partir de sources publiques.

| Étape | Script | Entrée | Sortie |
|---|---|---|---|
| 1. Téléchargement | `fetch_sources.py` | Poligraph (API) + MonVote2027 | `raw/` + `raw/manifest.json` |
| 2. Questions | `scripts/parse_monvote.py` | `raw/monvote/donnees.html` | `data/monvote_questions.json` |
| 3. Sources des positions | `scripts/parse_monvote_sources.py` | `raw/monvote/candidat/*.html` | `data/monvote_sources.json` |
| 4. Données web | `scripts/build_web_data.py` | étapes 2-3 + CSV Poligraph | `data/web/*.json` |
| 5. Page | `page/build_page.py` | `page/*` + `data/web/` | `docs/` (site GitHub Pages) + `page/index.html` (artifact) |

Tout lancer : `bash run_all.sh` (incrémental) ou `bash run_all.sh --fresh` (re-télécharge tout, l'ancien `raw/` est archivé).

Bibliothèque standard Python uniquement.

## Limites connues
- Les pages HTML de mesures de Poligraph sont protégées par un défi anti-robot (Vercel) : non téléchargées, par choix.
- L'API Poligraph ne fournit pas les mesures des programmes ; les mesures de la page sont curées à la main dans `page/app.js` (constante `THEMES`).
- Les positions sont celles de MonVote2027 (5 niveaux) ; leurs citations sont des résumés, à vérifier à la source.

## Publication
Le site public est le dossier `docs/`, servi par GitHub Pages (Settings > Pages > branche `main`, dossier `/docs`).
Après `bash run_all.sh`, il suffit de committer et pousser `docs/`.
La page porte `noindex` : elle n'apparaît pas dans les moteurs de recherche, mais toute personne ayant le lien peut l'ouvrir.
