# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-file, client-side web app that explores the official QGIS plugin catalog. Its primary purpose is **duplicate checking** — letting a developer verify whether a plugin already exists (by keyword and by name) before building a new one — plus catalog-wide statistics (downloads, authors, tags, version targets, growth over time). The UI is in Italian.

Almost everything lives in [qgis-plugin-explorer.html](qgis-plugin-explorer.html): HTML, all CSS (inline `<style>`), and all JS (inline `<script>`). The one local side file is [it-authors.js](it-authors.js), a hand-editable allowlist of known Italian QGIS authors/organizations, loaded via `<script src>` and exposed as `window.IT_AUTHORS_LIST` (see "solo autori .it" below). There is no build step, no package manager, no tests, and no server. Open the file in a browser to run it.

External runtime dependencies are CDN-loaded: Chart.js (charts) and Google Fonts. No data ever leaves the browser.

## Running

Open `qgis-plugin-explorer.html` directly in a browser, or serve the folder (`python3 -m http.server`) and visit the file. There is nothing to build or install.

## Data flow

The app never fetches the feed itself — `plugins.qgis.org` blocks cross-origin requests (CORS). Instead the user downloads one or more feeds and loads the files:

```
curl -s "https://plugins.qgis.org/plugins/plugins.xml?qgis=3.40" -o plugins-3.xml
curl -s "https://plugins.qgis.org/plugins/plugins.xml?qgis=4.0"  -o plugins-4.xml
```

Then they load those XML files via the "Carica file XML" button (**multiple selection**) or drag-and-drop (**multiple files at once**). `feed/plugins-3.xml` (QGIS 3.40) and `feed/plugins-4.xml` (QGIS 4.0) are sample feeds for development; the `feed/` folder is **git-ignored** (the feeds are downloadable data, not code — re-fetch with the curl commands above).

Key point: **the feed is already server-filtered by the QGIS version in its URL** (`?qgis=`). The in-app "Filtro versione" control further narrows the loaded set client-side using each plugin's `qgis_minimum_version` / `qgis_maximum_version`. The version dropdown also rewrites the displayed `curl` command.

**Both feeds are required for a correct analysis, and the app now merges them.** Because each feed is server-filtered by its `?qgis=` version, neither one alone is the full catalog: the `?qgis=3.40` feed omits plugins that declare compatibility only with QGIS 4.0, and the `?qgis=4.0` feed omits plugins not yet ported to 4.0. So a plugin can be present in one feed and absent from the other. When several feeds are loaded, every entry is accumulated into `RAW` and **deduped/merged across files** (keyed by `plugin_id`, keeping the highest version), so a single `ALL` set spans both QGIS-3 and QGIS-4 plugins. Load both `feed/plugins-3.xml` and `feed/plugins-4.xml` together for trustworthy duplicate checking and complete catalog statistics — loading only one gives a partial picture. The merged-feed status (number of files, entries collapsed) is reported in the status bar and in the stats scope note.

## Architecture (all inside the one `<script>`)

The script is organized into commented sections. The pipeline is:

`loadFiles(fileList)` reads each file and calls `ingest(xmlString, fileName)` per file → parse each `<pyqgis_plugin>` node into a plain JS object → append to global `RAW` → `dedupe(RAW)` → set global `ALL` → `computeStats()` + `render()`. Loading another file re-runs dedupe over the *accumulated* `RAW`, so feeds merge incrementally as files arrive.

Global state:
- `RAW` — every raw entry from every loaded file, accumulated (pre-dedupe)
- `FILES` — list of loaded files (`{name, count}`), used for the "N feed uniti" status/scope messages
- `ALL` — the deduped/merged plugin objects (one per plugin, spanning all loaded feeds)
- `VIEW` — the subset actually shown/charted, produced by `activeSet()` (version filter + `onlyIt`) via `computeStats`
- `charts` — live Chart.js instances, destroyed/recreated on refresh

`resetData()` (the "Svuota" button) clears `RAW`/`FILES`/`ALL`/`VIEW` and re-mutes the dashboard.

**Deduplication is the central non-obvious logic** (`dedupe` / `preferEntry`), and it now does double duty: collapsing per-version duplicates *within* a feed **and merging the same plugin *across* feeds** (e.g. a plugin present in both `?qgis=3.40` and `?qgis=4.0`). One plugin can appear multiple times (a stable and an experimental version share the same `name` but differ in `version`; the same plugin appears in two feeds). Entries are keyed by `plugin_id` (falling back to lowercased name) and merged into a single record: stable is preferred over experimental for descriptive fields, otherwise the **highest `version`** wins (`preferEntry` via `vcmp`); `downloads`/`votes` take the max; `experimental` is true only if *no* stable entry exists; `deprecated` is OR'd; `it` (the Italian-author heuristic — a `.it` domain in homepage/repository/tracker **or** an author/organization match against the `it-authors.js` allowlist over `author_name`+`uploaded_by`) is OR'd; `created` is the earliest date and `updated` the latest. When editing parsing or stats, preserve these merge semantics — counts and "is this a duplicate" answers depend on them.

Version comparison (`vparse`/`vcmp`) is numeric per-segment so `"3.40" > "3.4"` is handled correctly; use these helpers rather than string comparison anywhere versions are compared.

Display layers:
- `activeSet()` produces `VIEW` from `ALL` by applying the `onlyIt` toggle ("solo autori .it") and then the version filter mode (`off`/`compat`/`minge`/`maxlt`).
- `filtered()` applies the search query (scopes: name/description/about/tags/author, optional regex via `buildMatcher`) plus the hide-experimental / hide-deprecated / only-maintained toggles.
- `render()` paints the results table (sortable, paginated) and `renderRelated()` suggests tag-adjacent plugins. The QGIS column shows a `qgisClass()` badge — "solo v3" / "solo v4" / "v3 e v4" — derived from `qmin`/`qmax` against the `4.0` boundary; this is especially meaningful once both feeds are merged.
- `checkName()` powers the "is this name free?" duplicate check, surfacing exact and similar existing names.
- `computeStats()` + the `draw*` functions build the KPI tiles and Chart.js charts.
- `exportCsv()` (the "Esporta CSV" button) writes the currently filtered rows (`lastRows`) to a UTF-8 CSV.

## Conventions

- UI strings, comments, and labels are **Italian** — match that when adding user-facing text.
- All HTML output from feed data must go through `esc()`; search hit highlighting goes through `highlight()`.
- Plugin page URLs are derived from the download URL via `slugOf()` / `schedaUrl()`, not stored directly.
