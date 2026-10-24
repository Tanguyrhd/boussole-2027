"""Votes des groupes à l'Assemblée nationale (open data officiel, législatures 16 et 17).
Entrée : raw/an/scr16.zip, raw/an/scr17.zip (Scrutins.json.zip de data.assemblee-nationale.fr)
Sortie : data/web/an.json — un objet par scrutin public :
  id, date, titre, dossier, type (texte / motion / amendement / autre), res, pour, contre, abst, themes,
  grp : {candidat: [position majoritaire du groupe (1 pour, -1 contre, 0 abstention), cohésion]}
La position d'un groupe = la position la plus votée par ses membres (recalculée depuis le décompte) ; cohésion = part de ses votants sur cette position."""
import json, re, zipfile
from collections import Counter
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
# groupe politique (organeRef) -> candidat. Glucksmann : Place publique siège au sein du groupe socialiste.
GRP = {"PO800520": "le_pen", "PO845401": "le_pen", "PO800490": "melenchon", "PO845413": "melenchon",
       "PO800496": "glucksmann", "PO830170": "glucksmann", "PO845419": "glucksmann",
       "PO800538": "attal", "PO845407": "attal", "PO800514": "philippe", "PO845470": "philippe",
       "PO800508": "retailleau", "PO845425": "retailleau", "PO800526": "tondelier", "PO845439": "tondelier",
       "PO800502": "roussel", "PO845514": "roussel"}
POS = {"pour": 1, "contre": -1, "abstention": 0}
# thèmes : motifs sur l'intitulé du dossier législatif et le titre du scrutin (même découpage que le site)
TH = [("retraites", r"retraite|rectificative de la sécurité sociale pour 2023"),
      ("immig", r"immigration|asile|étrangers|nationalité|droit du sol|Schengen|frontière"),
      ("eco", r"loi de finances|budget|fiscal|impôt|taxe|entreprise|industri|commerce|économi|pouvoir d'achat|dette|banque|travail|emploi|chômage|salari"),
      ("solidarite", r"sécurité sociale|solidarité|handicap|pauvreté|minima|RSA|famille|protection sociale|aide sociale"),
      ("sante", r"santé|hôpita|médic|soins|fin de vie|aide à mourir|IVG|interruption volontaire|pharma|soignant"),
      ("energie", r"énergi|nucléaire|climat|environnement|biodiversité|transport|carbone|renouvelable|pollution"),
      ("agri", r"agricul|alimentation|élevage|pêche|forêt|rural"),
      ("logement", r"logement|loyer|habitat|locat|urbanisme|HLM"),
      ("securite", r"sécurité intérieure|police|justice|pénal|prison|terroris|délinquan|mineurs|narcotrafic|violences"),
      ("instit", r"Constitution|constitutionnel|électora|scrutin|élus|Parlement|référendum|collectivités|décentralisation|outre-mer|Nouvelle-Calédonie|Corse|motion de censure|déclaration du Gouvernement"),
      ("monde", r"Ukraine|Russie|Israël|Palestin|Gaza|militaire|défense|armées|international|traité|accord entre")]


def kind(t):
    t = t.lower()
    if t.startswith(("l'ensemble", "l'article unique", "la proposition de résolution", "la déclaration")): return "texte"
    if t.startswith("la motion"): return "motion"
    if "amendement" in t[:40]: return "amendement"
    return "autre"


out = []
for leg in ("16", "17"):
    z = zipfile.ZipFile(ROOT / f"raw/an/scr{leg}.zip")
    for n in z.namelist():
        s = json.load(z.open(n))["scrutin"]
        g = s["ventilationVotes"]["organe"]["groupes"]["groupe"]
        grp = {}
        for x in g:
            c = GRP.get(x["organeRef"])
            if not c: continue
            v = x["vote"]; d = v["decompteVoix"]
            nb = {1: int(d["pour"]), -1: int(d["contre"]), 0: int(d["abstentions"])}
            tot = sum(nb.values())
            if tot == 0: continue  # groupe qui n'a pas pris part au vote
            # Trop peu de votants pour parler au nom du groupe (moins de 10 % de ses membres, ou un seul député)
            if tot < max(2, 0.1 * int(x.get("nombreMembresGroupe") or 0)): continue
            # On recalcule la position majoritaire depuis le décompte : le champ officiel « positionMajoritaire »
            # est parfois incohérent (ex. scrutin 17/217 : RN 118 pour, 0 contre, noté « abstention »).
            top = max(nb.values()); best = [k for k, x in nb.items() if x == top]
            if len(best) > 1: continue  # égalité : pas de position majoritaire
            pos = best[0]
            grp[c] = [pos, round(nb[pos] / tot, 2)]
        titre = s["titre"]
        dos = ((s.get("objet") or {}).get("dossierLegislatif") or {}).get("libelle") or ""
        th = [k for k, p in TH if re.search(p, dos + " " + titre, re.I)] or ["autre"]
        sy = s["syntheseVote"]["decompte"]
        out.append({"id": s["uid"], "n": int(s["numero"]), "leg": int(leg), "date": s["dateScrutin"], "titre": titre[:300],
                    "dossier": dos[:200], "type": kind(titre), "res": "adopté" if s["sort"]["code"] == "adopté" else "rejeté",
                    "pour": int(sy["pour"]), "contre": int(sy["contre"]), "abst": int(sy["abstentions"]),
                    "themes": th, "grp": grp})
out.sort(key=lambda x: x["date"], reverse=True)
# Taux d'accord entre groupes, calculé sur TOUS les scrutins publics (amendements compris), par thème.
# Les amendements ne sont pas affichés un par un (leur titre ne dit pas leur contenu), mais ils comptent ici.
from itertools import combinations
CANDS = sorted(set(GRP.values()))
pairs = {}
for th in ["all"] + [k for k, _ in TH] + ["autre"]:
    vs = [x for x in out if th == "all" or th in x["themes"]]
    m = {}
    for a, b in combinations(CANDS, 2):
        both = [x for x in vs if a in x["grp"] and b in x["grp"]]
        if both: m[f"{a}|{b}"] = [round(sum(x["grp"][a][0] == x["grp"][b][0] for x in both) / len(both), 3), len(both)]
    pairs[th] = m
lisibles = [x for x in out if x["type"] in ("texte", "motion")]
web = {"pairs": pairs, "n": {th: sum(1 for x in out if th == "all" or th in x["themes"]) for th in pairs},
       "votes": lisibles, "periode": [min(x["date"] for x in out), max(x["date"] for x in out)]}
(ROOT / "data/web/an.json").write_text(json.dumps(web, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(out), "scrutins ; types :", Counter(x["type"] for x in out))
print("thèmes :", Counter(t for x in out for t in x["themes"]))
print("taille :", (ROOT / "data/web/an.json").stat().st_size)
