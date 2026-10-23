"""Votes finaux du Parlement européen (depuis 2019) -> data/web/europarl.json.

Source : HowTheyVote.eu, licence Open Database License (ODbL). La base dérivée publiée
dans docs/data/europarl.json est donc elle aussi sous ODbL (voir README).

Pour chaque vote final (is_main) : titre, date, résultat, thèmes, vote personnel de
Glucksmann et Bardella (eurodéputés), et position majoritaire de la délégation française
de chaque parti lié à un candidat.
"""
import csv, gzip, io, json
from collections import Counter, defaultdict
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "raw/europarl"
open_gz = lambda n: io.TextIOWrapper(gzip.open(RAW / f"{n}.csv.gz"), encoding="utf-8")

MEMBERS = {"197694": "glucksmann", "131580": "bardella"}  # id HowTheyVote -> id page
# libellé court du parti national (données HowTheyVote) -> candidat lié
DELEG = {"RN": "le_pen", "LFI": "melenchon", "Place publique": "glucksmann", "Hor": "philippe",
         "Ren": "attal", "EM": "attal", "LaREM/MoDEM": "attal", "Les Républicains": "retailleau",
         "R": "zemmour", "Europe Écologie": "tondelier", "Les Écologistes": "tondelier"}
POS = {"FOR": 1, "AGAINST": -1, "ABSTENTION": 0}

# code de sujet OEIL (préfixe le plus long d'abord) -> thème de la page
SUBJ = [("7.10", "immig"), ("7.30", "securite"), ("7.40", "securite"), ("4.30", "securite"),
        ("1.10", "societe"), ("1", "instit"), ("2.70", "eco"), ("2", "eco"),
        ("3.10", "agri"), ("3.15", "agri"), ("3.20", "energie"), ("3.60", "energie"), ("3.70", "energie"),
        ("3.40", "eco"), ("3.45", "eco"), ("3.50", "societe"), ("4.10", "solidarite"), ("4.15", "eco"),
        ("4.20", "sante"), ("4.40", "societe"), ("4.45", "societe"), ("4.50", "eco"), ("4.60", "eco"),
        ("4.70", "eco"), ("4", "solidarite"), ("5", "eco"), ("6", "monde"), ("8", "instit"), ("9", "societe")]
KEYWORDS = [("housing", "logement"), ("pension", "retraites"), ("asylum", "immig"), ("migra", "immig")]
def themes_of(codes, title):
    th = set()
    for c in codes:
        for pre, t in SUBJ:
            if c == pre or c.startswith(pre + "."):
                th.add(t); break
    low = title.lower()
    th |= {t for k, t in KEYWORDS if k in low}
    return sorted(th) or ["autre"]

votes = {v["id"]: v for v in csv.DictReader(open_gz("votes")) if v["is_main"] == "True"}
subj = defaultdict(list)
for r in csv.DictReader(open_gz("oeil_subject_votes")):
    if r["vote_id"] in votes: subj[r["vote_id"]].append(r["oeil_subject_code"])

personal = defaultdict(dict)                       # vote -> {candidat: position}
deleg = defaultdict(lambda: defaultdict(Counter))  # vote -> candidat -> Counter(positions)
with open_gz("member_votes") as f:
    r = csv.reader(f); h = next(r); I = {k: i for i, k in enumerate(h)}
    for row in r:
        vid = row[I["vote_id"]]
        if vid not in votes: continue
        pos = row[I["position"]]
        if row[I["member_id"]] in MEMBERS:
            personal[vid][MEMBERS[row[I["member_id"]]]] = POS.get(pos)  # None = n'a pas voté
        if row[I["country_code"]] == "FRA" and row[I["national_party_short_label"]] in DELEG:
            deleg[vid][DELEG[row[I["national_party_short_label"]]]][pos] += 1

out = []
for vid, v in votes.items():
    d = {}
    for cand, cnt in deleg[vid].items():
        voted = {k: n for k, n in cnt.items() if k in POS}
        if not voted: continue
        top, n = max(voted.items(), key=lambda kv: kv[1])
        d[cand] = [POS[top], round(n / sum(voted.values()), 2)]  # [position majoritaire, cohésion]
    out.append({"id": int(vid), "date": v["timestamp"][:10], "titre": v["display_title"] or v["procedure_title"],
                "proc": v["procedure_reference"], "res": v["result"], "pour": int(v["count_for"] or 0),
                "contre": int(v["count_against"] or 0), "abst": int(v["count_abstention"] or 0),
                "themes": themes_of(subj.get(vid, []), (v["display_title"] or "") + " " + v["procedure_title"]),
                "perso": personal.get(vid, {}), "deleg": d})
out.sort(key=lambda x: x["date"], reverse=True)
(ROOT / "data/web").mkdir(parents=True, exist_ok=True)
(ROOT / "data/web/europarl.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(out), "votes finaux ;", "thèmes :", dict(Counter(t for x in out for t in x["themes"])))
print("délégations présentes :", dict(Counter(c for x in out for c in x["deleg"])))
print("votes perso :", {m: sum(1 for x in out if x["perso"].get(m) is not None) for m in MEMBERS.values()})
