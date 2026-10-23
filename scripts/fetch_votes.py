"""Télécharge les votes individuels (Assemblée/Sénat) des candidats depuis l'API publique Poligraph.
Sortie : raw/poligraph/votes/{slug}.json (liste de votes, toutes pages)."""
import json, sys, time, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "raw/poligraph/votes"; OUT.mkdir(parents=True, exist_ok=True)
SLUGS = sys.argv[1:] or ["marine-le-pen", "gabriel-attal", "francois-ruffin", "fabien-roussel", "bruno-retailleau"]
UA = {"User-Agent": "boussole-2027 (github.com/Tanguyrhd/boussole-2027)"}
def get(url):
    for i in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r: return json.load(r)
        except Exception as e:
            print("retry", i, e, file=sys.stderr); time.sleep(10 * (i + 1))
    raise SystemExit("échec " + url)
for s in SLUGS:
    votes, page = [], 1
    while True:
        d = get(f"https://poligraph.fr/api/politiques/{s}/votes?limit=100&page={page}")
        votes += d["votes"]; tp = d["pagination"]["totalPages"]
        print(s, page, "/", tp, len(votes), flush=True)
        if page >= tp: break
        page += 1; time.sleep(4)
    (OUT / f"{s}.json").write_text(json.dumps({"stats": d["stats"], "votes": votes}, ensure_ascii=False), encoding="utf-8")
    time.sleep(4)
