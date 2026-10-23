"""Parse raw/monvote/candidat/*.html -> data/monvote_sources.json {candidat: {qid: {pos, sources}}}."""
import json, re, html
from pathlib import Path
from collections import Counter
ROOT = Path(__file__).resolve().parent.parent
get = lambda pat, s: (lambda m: html.unescape(m.group(1).strip()) if m else "")(re.search(pat, s, re.S))
out, types = {}, Counter()
for f in sorted((ROOT / "raw/monvote/candidat").glob("*.html")):
    s = f.read_text(encoding="utf-8")
    rows = [r for r in s.split('<div class="cand-q-row')[1:] if "data-qid=" in r[:400]]
    cand = {}
    for r in rows:
        qid = get(r'data-qid="([^"]+)"', r)
        srcs = []
        for it in r.split('<div class="cand-source-item">')[1:]:
            src = {"type": get(r'cand-src-type">(.*?)</span>', it), "date": get(r'cand-src-date">(.*?)</span>', it),
                   "titre": get(r'cand-src-titre">(.*?)</div>', it), "citation": get(r'cand-src-citation">(.*?)</p>', it),
                   "url": get(r'cand-src-link" href="([^"]+)"', it)}
            types[src["type"]] += 1
            srcs.append(src)
        cand[qid] = {"sources": srcs}
    out[f.stem] = cand
(ROOT / "data/monvote_sources.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print({k: len(v) for k, v in out.items()}); print(types.most_common(6))
