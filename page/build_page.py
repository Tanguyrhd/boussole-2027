"""Construit deux versions de la page à partir des mêmes morceaux.

- page/index.html + page/data/ : version artifact Claude (la plateforme ajoute elle-même
  doctype, <head>, charset, viewport et un petit reset CSS).
- docs/index.html + docs/data/ : version autonome pour GitHub Pages, avec ce squelette
  ajouté explicitement. Sans lui, la règle [hidden] n'existe pas (tous les onglets
  s'affichent) et la page n'est pas adaptée au mobile.
"""
import shutil
from pathlib import Path
P = Path(__file__).resolve().parent
SITE = P.parent / "docs"  # dossier servi par GitHub Pages
r = lambda n: (P / n).read_text(encoding="utf-8")
inner_head = r("head.html") + r("base.css") + "\n" + r("extra.css")
inner_body = r("body.html") + "\n<script>\n" + r("glossaire.js") + r("app.js") + "\n</script>\n"

STATIC_HEAD = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Comparateur personnel de la présidentielle 2027 : positions sourcées, votes, affaires et fact-checks.">
<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
"""
FOOTER = """<footer class="wrap src" style="padding-block:0 40px">
Page personnelle, non affiliée à un parti ni à un média. Données : MonVote2027 et Poligraph,
dont les contenus restent la propriété de leurs auteurs. Signaler une erreur : écris-moi.
</footer>
"""

def copy_data(dest):
    (dest / "data").mkdir(parents=True, exist_ok=True)
    for f in (P.parent / "data/web").glob("*.json"):
        shutil.copy(f, dest / "data" / f.name)

# 1. version artifact (inchangée)
(P / "index.html").write_text(inner_head + inner_body, encoding="utf-8")
copy_data(P)
# 2. version GitHub Pages
SITE.mkdir(exist_ok=True)
static = STATIC_HEAD + inner_head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "") \
         + "</head>\n<body>\n" + inner_body.replace("\n<script>", FOOTER + "<script>", 1) + "</body>\n</html>\n"
(SITE / "index.html").write_text(static, encoding="utf-8")
(SITE / ".nojekyll").write_text("", encoding="utf-8")  # GitHub Pages sert les fichiers tels quels
copy_data(SITE)
print("page/index.html et docs/index.html construits ; données :", sorted(p.name for p in (SITE / "data").glob("*.json")))
