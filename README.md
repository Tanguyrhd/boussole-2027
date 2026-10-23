# Boussole 2027

Comparateur personnel et sourcé de la présidentielle française de 2027.

**Site : https://tanguyrhd.github.io/boussole-2027/**

Page personnelle, non affiliée à un parti ni à un média. Elle porte `noindex` : elle n'apparaît pas dans les moteurs de recherche, mais toute personne ayant le lien peut l'ouvrir.

## Ce que contient le site

| Onglet | Contenu | Source principale |
|---|---|---|
| Thèmes | 100 questions de MonVote2027 rangées en 12 thèmes, avec la position des 10 candidats et les sources de chaque position. Mesures clés curées à la main. | MonVote2027 |
| Mon affinité | Score de proximité à partir de tes réponses et de l'importance donnée à chaque thème (stocké dans le navigateur). | MonVote2027 |
| Face à face | Deux candidats comparés question par question, plus le taux de votes identiques de leurs partis à l'Assemblée et au Parlement européen. | MonVote2027, open data AN, HowTheyVote |
| Votes | Partis uniquement. « Avec qui vote ce parti » (barres de proximité) et « Comparer deux partis, vote par vote », à l'Assemblée nationale ou au Parlement européen. En dessous : les positions MonVote appuyées par un vote, et l'emplacement de la future rubrique « Dit / a voté ». | open data AN, HowTheyVote |
| Justice | Affaires où chaque candidat est mis en cause : barres par stade (définitive, non définitive, en cours, relaxe), carte par type d'infraction, puis le détail. Les affaires où il est plaignant ou victime sont listées à part. | Poligraph |
| Fact-checks | Déclarations vérifiées dont le candidat est l'auteur direct, filtrables par candidat, verdict, année et sujet. | Poligraph |
| Controverses | Polémiques classées par niveau de preuve. | curé à la main |
| Méthode | Sources, calculs, limites. | — |

## Pipeline de données

| Étape | Script | Entrée | Sortie |
|---|---|---|---|
| 1. Téléchargement | `fetch_sources.py` | Poligraph (API), MonVote2027, HowTheyVote, open data AN | `raw/` + `raw/manifest.json` |
| 2. Questions | `scripts/parse_monvote.py` | `raw/monvote/donnees.html` | `data/monvote_questions.json` |
| 3. Sources des positions | `scripts/parse_monvote_sources.py` | `raw/monvote/candidat/*.html` | `data/monvote_sources.json` |
| 4. Données web | `scripts/build_web_data.py` (+ `scripts/fc_sujets.py`) | étapes 2-3 + CSV Poligraph | `data/web/questions.json`, `affaires.json`, `factchecks.json`, `meta.json` |
| 5. Parlement européen | `scripts/build_europarl.py` | `raw/europarl/*.csv.gz` | `data/web/europarl.json` |
| 6. Assemblée nationale | `scripts/build_an.py` | `raw/an/scr16.zip`, `raw/an/scr17.zip` | `data/web/an.json` |
| 7. Page | `page/build_page.py` | `page/*` + `data/web/` | `docs/index.html` + `docs/data/*.json` |

Tout lancer : `bash run_all.sh` (incrémental) ou `bash run_all.sh --fresh` (re-télécharge tout ; l'ancien `raw/` est archivé).
Python 3, bibliothèque standard uniquement.

Hors pipeline : `scripts/fetch_votes.py` télécharge les votes individuels des candidats députés (API Poligraph, `raw/poligraph/votes/`). Il sert au prototype de détection « Dit / a voté », qui est gardé en local (`detect/`, exclu du dépôt) tant que ses cas ne sont pas vérifiés.

### Structure de la page

`page/head.html`, `base.css`, `extra.css`, `body.html`, `glossaire.js`, `app.js` sont assemblés par `page/build_page.py` en un seul `docs/index.html` ; les JSON de `data/web/` sont copiés dans `docs/data/`. Ne pas modifier `docs/` à la main.

## Mettre à jour le site

```bash
bash run_all.sh
git add docs && git commit -m "Mise à jour des données" && git push
```

GitHub Pages sert le dossier `docs/` de la branche `main` (Settings > Pages). La mise en ligne prend une à deux minutes.

## Choix de méthode et limites connues

- **Positions** : celles de MonVote2027 (5 niveaux, −2 à +2). Une position peut mélanger des sources de dates différentes, et parfois les déclarations d'un proche (Bardella pour Le Pen). Les citations sont des résumés, à vérifier à la source.
- **Mesures des programmes** : les pages de Poligraph sont protégées par un défi anti-robot ; elles ne sont pas téléchargées, par choix. Les mesures clés sont curées à la main dans `page/app.js` (constante `THEMES`).
- **Votes à l'Assemblée** : la position d'un groupe est recalculée depuis le décompte des voix, car le champ officiel `positionMajoritaire` est incohérent dans environ 2 % des cas. Les taux d'accord comptent tous les scrutins publics, amendements compris. Seuls les votes sur l'ensemble d'un texte et les motions sont listés, car le titre d'un amendement ne dit pas son contenu.
- **Rattachements** : Glucksmann est rattaché au groupe socialiste, où siège Place publique. Reconquête n'a pas de groupe à l'Assemblée, le PCF n'a pas d'eurodéputé, et Ruffin n'a pas de groupe à lui.
- **Votes européens** : seuls les votes finaux sur un texte sont gardés. Les propositions de rejet et les votes de procédure sont écartés, car leur sens est inversé.
- **Thèmes des votes et sujets des fact-checks** : attribués par mots-clés, donc approximatifs.
- **Taux d'accord entre partis** : deux oppositions votent souvent « contre » ensemble pour des raisons opposées. Un fort accord ne veut pas dire les mêmes idées.
- **Justice** : la base Poligraph est citoyenne et peut être incomplète. Le nombre d'affaires dépend aussi de la durée de carrière et de l'exposition médiatique.

## Licences des données

- **Votes à l'Assemblée nationale** : [open data de l'Assemblée nationale](https://data.assemblee-nationale.fr), sous Licence Ouverte (Etalab).
- **Votes au Parlement européen** : [HowTheyVote.eu](https://howtheyvote.eu), sous [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/). `docs/data/europarl.json` est une base dérivée, publiée sous la même licence.
- **Positions des candidats** : MonVote2027 (données ouvertes, monvote2027.fr/donnees).
- **Affaires et fact-checks** : Poligraph (API publique). Les contenus restent la propriété de leurs auteurs.

Une erreur ? [Ouvrir une issue](https://github.com/Tanguyrhd/boussole-2027/issues).
