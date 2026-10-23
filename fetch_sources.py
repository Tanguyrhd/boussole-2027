"""Télécharge les sources brutes de la Boussole 2027 (Poligraph + MonVote2027).

    python3 fetch_sources.py

Bibliothèque standard uniquement. Incrémental : un fichier déjà présent n'est pas re-téléchargé
(supprimer raw/ pour tout rafraîchir). Respecte la limite de débit de Poligraph (429 -> attente).
Sortie : raw/ (fichiers bruts) + raw/manifest.json (statut de chaque URL).
"""
import json, time, urllib.request, urllib.error
from pathlib import Path

OUT = Path(__file__).parent / "raw"
UA = "Boussole2027-perso/0.1 (usage personnel, non commercial)"
DELAY = 4.0          # Poligraph renvoie 429 à 1 req/s
MAX_RETRY = 4
PG = "https://poligraph.fr"
MV = "https://monvote2027.fr"

CANDIDATS = {  # slug Poligraph : slug MonVote2027
    "marine-le-pen": "le-pen", "jean-luc-melenchon": "melenchon",
    "raphael-glucksmann": "glucksmann", "edouard-philippe": "philippe",
    "gabriel-attal": "attal", "bruno-retailleau": "retailleau",
    "eric-zemmour": "zemmour", "marine-tondelier": "tondelier",
    "fabien-roussel": "roussel", "francois-ruffin": "ruffin",
}
_THEMES_POLIGRAPH = ["logement-urbanisme", "sante", "emploi-travail", "retraites",
          "solidarites-protection-sociale", "economie-budget", "environnement-energie",
          "securite-justice", "societe-droits-libertes", "education-culture", "immigration",
          "transports", "agriculture-alimentation", "numerique-tech",
          "affaires-etrangeres-defense", "institutions"]

def jobs():
    yield "poligraph/robots.txt", f"{PG}/robots.txt"
    yield "poligraph/api/affaires.csv", f"{PG}/api/export/affaires?limit=50000"
    yield "poligraph/api/politiques.csv", f"{PG}/api/export/politiques?limit=50000"
    yield "poligraph/api/factchecks.csv", f"{PG}/api/export/factchecks?limit=10000"
    yield "poligraph/api/votes_rss.xml", f"{PG}/api/rss/votes.xml"
    yield "monvote/donnees.html", f"{MV}/donnees"
    for mv in CANDIDATS.values():
        yield f"monvote/candidat/{mv}.html", f"{MV}/candidat/{mv}"
    # API JSON (non documentée mais utilisée par le serveur MCP officiel de Poligraph)
    yield "poligraph/api/election_presidentielle_2027.json", f"{PG}/api/elections/presidentielle-2027"
    # NB : les pages HTML de Poligraph (mesures des programmes) sont protégées par un défi anti-robot
    # Vercel (en-tête x-vercel-mitigated: challenge). Choix volontaire du site : on ne les télécharge pas.

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read(), None
    except urllib.error.HTTPError as e:
        return e.code, (e.headers.get("Content-Type", "") if e.headers else ""), b"", (e.headers.get("Retry-After") if e.headers else None)
    except Exception as e:
        return None, repr(e), b"", None

def fetch_with_retry(url):
    for attempt in range(MAX_RETRY + 1):
        status, ctype, body, retry_after = fetch(url)
        if status not in (429, 503) or attempt == MAX_RETRY:
            return status, ctype, body
        wait = int(retry_after) if (retry_after or "").isdigit() else 30 * 2 ** attempt
        print(f"    {status} -> nouvelle tentative dans {wait}s", flush=True)
        time.sleep(wait)

def main():
    OUT.mkdir(exist_ok=True)
    mpath = OUT / "manifest.json"
    old = {m["url"]: m for m in json.loads(mpath.read_text(encoding="utf-8"))["items"]} if mpath.exists() else {}
    manifest, todo = [], list(jobs())
    for n, (rel, url) in enumerate(todo, 1):
        if (OUT / rel).exists():
            manifest.append(old.get(url, {"file": rel, "url": url, "status": 200}))
            continue
        status, ctype, body = fetch_with_retry(url)
        ok = status == 200 and body
        if ok:
            (OUT / rel).parent.mkdir(parents=True, exist_ok=True)
            (OUT / rel).write_bytes(body)
        manifest.append({"file": rel if ok else None, "url": url, "status": status,
                         "content_type": ctype, "bytes": len(body)})
        print(f"[{n}/{len(todo)}] {status} {len(body):>9} o  {url}", flush=True)
        time.sleep(DELAY)
    mpath.write_text(json.dumps({"fetched_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "items": manifest},
                                ensure_ascii=False, indent=1), encoding="utf-8")
    good = sum(1 for m in manifest if m.get("file"))
    print(f"\nTerminé : {good}/{len(manifest)} fichiers présents -> {OUT}", flush=True)

if __name__ == "__main__":
    main()
