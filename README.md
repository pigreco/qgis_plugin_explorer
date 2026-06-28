# QGIS Plugin Explorer

App web **client-side, a file singolo**, per esplorare il catalogo ufficiale dei plugin QGIS. Scopo principale: **verificare i duplicati** — controllare se un plugin esiste già (per parola chiave e per nome) prima di svilupparne uno nuovo — più statistiche d'insieme sul catalogo (download, autori, tag, versioni QGIS target, crescita nel tempo). L'interfaccia è in italiano.

Nessun dato lascia il browser: tutta l'elaborazione è locale.

## Avvio

Apri direttamente [`qgis-plugin-explorer.html`](qgis-plugin-explorer.html) nel browser, oppure servi la cartella e visita il file:

```bash
python3 -m http.server
# poi apri http://localhost:8000/qgis-plugin-explorer.html
```

Non c'è nulla da installare o compilare. Dipendenze runtime caricate da CDN: Chart.js (grafici) e Google Fonts.

## Caricare i dati

L'app **non** scarica il feed da sola: `plugins.qgis.org` blocca le richieste cross-origin (CORS). Scarichi tu i feed e li carichi nell'app.

```bash
curl -s "https://plugins.qgis.org/plugins/plugins.xml?qgis=3.40" -o plugins-3.40.xml
curl -s "https://plugins.qgis.org/plugins/plugins.xml?qgis=4.0"  -o plugins-4.0.xml
```

Poi carichi i file con il bottone **"Carica file XML"** (selezione multipla) o trascinandoli nella pagina (anche più file insieme).

> **Carica entrambi i feed.** Ogni feed è già filtrato lato server dalla versione nel suo URL (`?qgis=`), quindi nessuno dei due da solo è il catalogo completo: il feed `?qgis=3.40` omette i plugin compatibili solo con QGIS 4.0, e viceversa. L'app **fonde** i feed caricati (dedup per `plugin_id`, tenendo la versione più alta), così ottieni un quadro completo per il controllo duplicati e le statistiche.

I feed di esempio per lo sviluppo stanno in `feed/`, **ignorata da git** (sono dati scaricabili, non codice — vedi [`.gitignore`](.gitignore)). Scaricali con i comandi qui sopra.

## Funzioni principali

- **Controllo nome libero** — verifica se un nome plugin è già usato (match esatto e simili).
- **Ricerca** su nome/descrizione/about/tag/autore, con regex opzionale ed evidenziazione.
- **Filtri** per versione QGIS (compatibilità), sperimentali, deprecati, solo mantenuti.
- **Filtro "solo autori .it"** — euristica: dominio `.it` negli URL **oppure** autore/organizzazione presente in una allowlist curata della community QGIS italiana. La lista è nel file editabile a mano [`it-authors.js`](it-authors.js): vedi i commenti nel file per come aggiornarla (e quali "falsi amici", es. `CNR`/`CNRS` francesi, NON inserire).
- **Statistiche** — KPI e grafici (download, autori, tag, target di versione, crescita).
- **Esporta CSV** delle righe filtrate.

## Struttura

- [`qgis-plugin-explorer.html`](qgis-plugin-explorer.html) — l'app: HTML, CSS inline, JS inline.
- [`it-authors.js`](it-authors.js) — allowlist autori/organizzazioni italiane, editabile a mano.
- `feed/` — feed XML di esempio (ignorata da git).

## Licenza

[MIT](LICENSE)
