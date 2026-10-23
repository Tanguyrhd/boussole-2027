"""Construit les JSON servis par la page (data/web/) à partir des données brutes.

Entrées : data/monvote_questions.json, data/monvote_sources.json, data/poligraph_mesures.json,
          raw/poligraph/api/*.csv
Sorties : data/web/questions.json, mesures.json, affaires.json, factchecks.json, meta.json
"""
import csv, json, sys, time
from collections import Counter
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from fc_sujets import sujets  # classement automatique par mots-clés
ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "data/web"; WEB.mkdir(parents=True, exist_ok=True)

# id MonVote (positions) | id fiche MonVote | slug Poligraph
CANDS = [("le_pen", "le-pen", "marine-le-pen"), ("melenchon", "melenchon", "jean-luc-melenchon"),
         ("glucksmann", "glucksmann", "raphael-glucksmann"), ("philippe", "philippe", "edouard-philippe"),
         ("attal", "attal", "gabriel-attal"), ("retailleau", "retailleau", "bruno-retailleau"),
         ("zemmour", "zemmour", "eric-zemmour"), ("tondelier", "tondelier", "marine-tondelier"),
         ("roussel", "roussel", "fabien-roussel"), ("ruffin", "ruffin", "francois-ruffin")]
EXTRA = {"jordan-bardella": "bardella"}  # pressenti Premier ministre : affaires et fact-checks seulement
PG2ID = {pg: mv for mv, _, pg in CANDS} | EXTRA

# ---------- 1. Questions MonVote : un thème par question, règle de priorité explicite ----------
RETRAITES = {"q4", "q31"}
PRIORITY = [("logement", {"logement"}), ("agri", {"agriculture"}), ("immig", {"immigration"}),
            ("sante", {"sante"}), ("energie", {"energie", "environnement", "transport"}),
            ("instit", {"institutions", "democratie"}), ("securite", {"securite", "justice"}),
            ("monde", {"europe", "international", "defense", "diplomatie"}),
            ("solidarite", {"social"}), ("eco", {"economie", "fiscal", "travail"})]
def theme_of(q):
    if q["qid"] in RETRAITES: return "retraites"
    for th, tags in PRIORITY:
        if tags & set(q["tags"]): return th
    return "societe"

norm = lambda t: t.replace("Assemblee", "Assemblée").replace("Declaration", "Déclaration").replace("Communique ", "Communiqué ")
qs = json.loads((ROOT / "data/monvote_questions.json").read_text(encoding="utf-8"))
srcs = json.loads((ROOT / "data/monvote_sources.json").read_text(encoding="utf-8"))
out = []
for q in qs:
    item = {"qid": q["qid"], "n": int(q["qid"][1:]), "theme": theme_of(q), "text": q["text"],
            "context": q["context"], "pos": {}, "src": {}}
    for mv, page, _ in CANDS:
        item["pos"][mv] = q["positions"].get(mv)
        lst = srcs.get(page, {}).get(q["qid"], {}).get("sources", [])
        item["src"][mv] = [{"type": norm(s["type"]), "date": s["date"], "titre": s["titre"],
                            "citation": s["citation"][:400], "url": s["url"]} for s in lst]
    out.append(item)
(WEB / "questions.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("questions par thème:", dict(Counter(x["theme"] for x in out)))
print("sources de type vote:", sum(1 for x in out for l in x["src"].values() for s in l if s["type"].startswith("Vote")))

# ---------- 2. Mesures Poligraph (si parsées) ----------
mp = ROOT / "data/poligraph_mesures.json"
if mp.exists():
    mes = [m | {"cand": PG2ID[m["cand"]]} for m in json.loads(mp.read_text(encoding="utf-8")) if m["cand"] in PG2ID]
    (WEB / "mesures.json").write_text(json.dumps(mes, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("mesures:", dict(Counter(m["cand"] for m in mes)))

# ---------- 3. Affaires judiciaires (Poligraph, export CSV) ----------
PROBITE = {"DETOURNEMENT_FONDS_PUBLICS", "PRISE_ILLEGALE_INTERETS", "EMPLOI_FICTIF", "FAVORITISME", "ABUS_CONFIANCE",
           "FINANCEMENT_ILLEGAL_CAMPAGNE", "RECEL", "CORRUPTION", "CORRUPTION_PASSIVE", "TRAFIC_INFLUENCE",
           "FAUX_ET_USAGE_FAUX", "FRAUDE_FISCALE", "BLANCHIMENT", "ABUS_BIENS_SOCIAUX"}
EXPRESSION = {"DIFFAMATION", "INJURE", "INCITATION_HAINE"}
STAGE = {"CONDAMNATION_DEFINITIVE": "définitive", "CONDAMNATION_PREMIERE_INSTANCE": "non définitive",
         "POURVOI_EN_CASSATION": "non définitive", "APPEL_EN_COURS": "non définitive",
         "RELAXE": "relaxe", "NON_LIEU": "relaxe", "CLASSEMENT_SANS_SUITE": "relaxe",
         "INSTRUCTION_CLOTUREE_SANS_MISE_EN_EXAMEN": "relaxe", "PRESCRIPTION": "relaxe"}
aff = []
for r in csv.DictReader(open(ROOT / "raw/poligraph/api/affaires.csv", encoding="utf-8-sig")):
    if r["Slug politique"] not in PG2ID: continue
    cat = r["Catégorie (code)"]
    aff.append({"cand": PG2ID[r["Slug politique"]], "titre": r["Titre"], "statut": r["Statut"],
                "stade": STAGE.get(r["Statut (code)"], "en cours"),
                "famille": "probité" if cat in PROBITE else "expression" if cat in EXPRESSION else "autre",
                "categorie": r["Catégorie"], "role": r["Implication"], "role_code": r["Implication (code)"],
                "date": r["Date du verdict"] or r["Date de début"] or r["Date des faits"], "peine": r["Peine (texte libre)"],
                "juridiction": "" if r["Juridiction"] == "null" else r["Juridiction"], "description": r["Description"][:700],
                "source": r["Première source (URL)"], "page": r["Page Poligraph"]})
(WEB / "affaires.json").write_text(json.dumps(aff, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("affaires:", dict(Counter(a["cand"] for a in aff)))

# ---------- 4. Fact-checks où le candidat est l'auteur direct de la déclaration ----------
fc = []
for r in csv.DictReader(open(ROOT / "raw/poligraph/api/factchecks.csv", encoding="utf-8-sig")):
    if r["Slug politique"] in PG2ID and r["Auteur direct"] == "oui":
        fc.append({"cand": PG2ID[r["Slug politique"]], "titre": r["Titre"], "verdict": r["Verdict (code)"],
                   "fc": r["Fact-checker"], "url": r["URL source"], "sujets": sujets(r["Titre"]),
                   "date": r["Date de la déclaration"] or r["Date de publication"]})
(WEB / "factchecks.json").write_text(json.dumps(fc, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("fact-checks:", dict(Counter(f["cand"] for f in fc)))

man = json.loads((ROOT / "raw/manifest.json").read_text(encoding="utf-8")) if (ROOT / "raw/manifest.json").exists() else {}
(WEB / "meta.json").write_text(json.dumps({"built_at": time.strftime("%Y-%m-%d"), "fetched_at": man.get("fetched_at", "")}), encoding="utf-8")
for f in sorted(WEB.glob("*.json")): print(f.name, f.stat().st_size)
