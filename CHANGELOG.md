# Changelog

Tutte le modifiche rilevanti a questo progetto sono documentate in questo file.

Il formato si ispira a [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).

## [Non rilasciato] — 2026-06-28

### Aggiunto
- **Fallback grafici**: se Chart.js non si carica (offline o CDN bloccata), i box dei grafici mostrano un avviso e ricerca, controllo duplicati e statistiche numeriche restano operativi (prima un errore bloccava `computeStats`).
- **Ordinamento tabella da tastiera**: le intestazioni ordinabili sono raggiungibili con Tab e attivabili con Invio/Spazio, con stato `aria-sort` annunciato dagli screen reader.
- **SRI su Chart.js**: lo script CDN ora ha `integrity` (SHA-512) + `crossorigin`, a protezione da una CDN compromessa.
- Scaglioni intermedi **25** e **50** nel selettore «Mostra» della tabella.

### Modificato
- **Caricamento multi-file in batch**: con più feed caricati insieme, dedup/fusione, statistiche e grafici vengono ricostruiti **una sola volta** a fine batch invece di una volta per file.
- **Ricerca più reattiva**: i campi testuali (nome, autore, descrizione, about, tag) vengono messi in minuscolo una volta sola in fase di parsing, non a ogni battitura.
- Campo di ricerca passato a `type="search"` (mostra la “×” nativa di pulizia su mobile).

### Corretto
- **Flicker del drag & drop**: l'outline verde di rilascio file non lampeggia più mentre si trascina sopra la pagina (contatore di profondità su `dragenter`/`dragleave`).
- Rimosso un `try/catch` irraggiungibile attorno a `DOMParser.parseFromString` (l'errore reale è già gestito dal controllo su `<parsererror>`).

## [0.1.0] — 2026-06-28

### Aggiunto
- Primo rilascio: app web a file singolo per esplorare il catalogo ufficiale dei plugin QGIS, con controllo duplicati (per parola chiave e per nome) e statistiche d'insieme.
- Fusione di più feed (`?qgis=3.40` + `?qgis=4.0`) deduplicati per `plugin_id`.
- Allowlist autori italiani editabile ([it-authors.js](it-authors.js)) e script [extract-authors.py](extract-authors.py).
