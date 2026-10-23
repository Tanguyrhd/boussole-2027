"""Parse raw/monvote/donnees.html -> data/monvote_questions.json (100 questions x positions)."""
import json, re, html
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
LAB = {"Tout à fait pour": 2, "Plutôt pour": 1, "Neutre / partagé": 0, "Plutôt contre": -1, "Tout à fait contre": -2}
s = (ROOT / "raw/monvote/donnees.html").read_text(encoding="utf-8")
blocks = [b for b in s.split('<div class="donnees-question')[1:] if "data-qid=" in b[:300]]
out = []
for b in blocks:
    qid = re.search(r'data-qid="([^"]+)"', b).group(1)
    tags = re.search(r'data-tags="([^"]*)"', b).group(1).split(",")
    ctx = re.search(r'q-info-tooltip">(.*?)</span>', b, re.S)
    text = re.search(r'donnees-q-text">(.*?)</span>', b, re.S).group(1)
    pos = {}
    for col in b.split('<div class="pos-col">')[1:]:
        lab = re.search(r'pos-col-label">(.*?)</div>', col).group(1).strip()
        for cid in re.findall(r'data-cid="([^"]+)"', col):
            pos[cid] = LAB[lab]
    out.append({"qid": qid, "tags": tags, "text": html.unescape(text.strip()),
                "context": html.unescape(ctx.group(1).strip()) if ctx else "", "positions": pos})
(ROOT / "data").mkdir(exist_ok=True)
(ROOT / "data/monvote_questions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(out), "questions")
