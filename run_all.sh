#!/usr/bin/env bash
# Chaîne complète : téléchargement -> parsing -> données web -> page.
# Usage : bash run_all.sh   (ajouter --fresh pour tout re-télécharger)
set -euo pipefail
cd "$(dirname "$0")"
if [[ "${1:-}" == "--fresh" ]]; then mv raw "raw_$(date +%Y%m%d_%H%M%S)"; fi
python3 fetch_sources.py
python3 scripts/parse_monvote.py
python3 scripts/parse_monvote_sources.py
python3 scripts/build_web_data.py
python3 scripts/build_europarl.py
python3 page/build_page.py
