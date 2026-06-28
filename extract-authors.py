#!/usr/bin/env python3
"""
Estrae l'elenco UNIVOCO degli autori dai feed XML in feed/.

Legge author_name (e opzionalmente uploaded_by) da ogni <pyqgis_plugin>
dei file feed/plugins-*.xml, normalizza e deduplica, e stampa la lista
ordinata. Utile per individuare nuovi nomi da aggiungere a it-authors.js.

Uso:
    python3 extract-authors.py                 # solo author_name
    python3 extract-authors.py --uploaders     # include anche uploaded_by
    python3 extract-authors.py --counts        # mostra n. plugin per autore
"""
import argparse
import glob
import os
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter

FEED_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "feed")


def text(node, tag):
    el = node.find(tag)
    return (el.text or "").strip() if el is not None else ""


def norm_key(s):
    """Chiave di dedup: case-insensitive + spazi normalizzati."""
    return re.sub(r"\s+", " ", s).strip().casefold()


def is_mixed_case(s):
    return s != s.lower() and s != s.upper()


def main():
    ap = argparse.ArgumentParser(description="Estrae autori univoci dai feed XML.")
    ap.add_argument("--uploaders", action="store_true",
                    help="includi anche il campo uploaded_by")
    ap.add_argument("--counts", action="store_true",
                    help="mostra il numero di plugin per autore")
    args = ap.parse_args()

    files = sorted(glob.glob(os.path.join(FEED_DIR, "plugins-*.xml")))
    if not files:
        sys.exit(f"Nessun feed trovato in {FEED_DIR}/ (plugins-*.xml)")

    # raccolta grezza: per ogni chiave normalizzata, le varie forme con conteggio
    groups = {}
    raw = 0
    for path in files:
        tree = ET.parse(path)
        for plugin in tree.getroot().findall("pyqgis_plugin"):
            values = [text(plugin, "author_name")]
            if args.uploaders:
                values.append(text(plugin, "uploaded_by"))
            for value in values:
                if not value:
                    continue
                raw += 1
                groups.setdefault(norm_key(value), Counter())[value] += 1

    # per ogni gruppo scegli la forma canonica: prima mixed-case, poi la piu frequente
    authors = {}
    for forms in groups.values():
        canonical = max(forms.items(), key=lambda kv: (is_mixed_case(kv[0]), kv[1]))[0]
        authors[canonical] = sum(forms.values())

    print(f"# {len(authors)} autori univoci da {len(files)} feed "
          f"({raw - len(authors)} duplicati rimossi)", file=sys.stderr)
    for author in sorted(authors, key=str.casefold):
        if args.counts:
            print(f"{authors[author]}\t{author}")
        else:
            print(author)


if __name__ == "__main__":
    main()
