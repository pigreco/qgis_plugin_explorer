/* ============================================================
   Allowlist della community QGIS italiana — FILE EDITABILE A MANO
   ============================================================
   Il feed plugins.xml non ha un campo "nazione": il solo dominio .it
   cattura <0,5% dei plugin (quasi tutti pubblicano su github/gitlab).
   Questa lista, abbinata al controllo sul dominio .it, alza nettamente
   il recall del filtro "solo autori .it" mantenendo alta la precisione.

   COME AGGIORNARLA
   - Aggiungi una stringa per ogni autore o organizzazione italiana.
   - Il testo viene cercato (case-insensitive, su confini di parola) dentro
     author_name + uploaded_by di ogni plugin. Quindi "giulio fattori"
     intercetta anche "Giulio Fattori & Valerio Pinna".
   - Gli spazi si scrivono come "\\s+" se vuoi tollerare spazi multipli;
     uno spazio normale va comunque bene. Puoi usare sintassi regex
     (es. "raf-?douglas", "cnr-?igag", "arpa\\s+(?:umbria|piemonte)").
   - Niente "\\b" iniziale/finale: lo aggiunge automaticamente l'app.

   ⚠ FALSI AMICI DA NON INSERIRE
   - "CNR" / "CNRS" da soli sono FRANCESI (Compagnie Nationale du Rhône,
     Centre National de la Recherche Scientifique). Inserisci solo gli
     istituti italiani: CNR-IGAG, IGAG-CNR, IIA-CNR.
   - "Oslandia", "3Liz", "BRGM", "Camptocamp" sono francesi.
   - "NextGIS" è russo.
   Inserisci preferibilmente NOMI COMPLETI o organizzazioni, non cognomi
   comuni isolati, per evitare di pescare omonimi stranieri.
   ============================================================ */
window.IT_AUTHORS_LIST = [
  // organizzazioni / aziende
  'faunalia','itopen','gis3w','gter','adarte','planetek','seacoop','eagleprojects',
  'cnr-?igag','igag-?cnr','iia-?cnr',
  'arpa\\s+(?:umbria|piemonte|lazio|veneto|toscana|sicilia|liguria|emilia)',
  // persone
  'salvatore\\s+fiandaca','alessandro\\s+pasotti','matteo\\s+ghetta','enrico\\s+ferreguti',
  'giulio\\s+fattori','valerio\\s+pinna','enzo\\s+cocca','federico\\s+gianoli','raf-?douglas',
  'mauro\\s+alberti','mauro\\s+de\\s?donatis','giuseppe\\s+de\\s+marco','giuseppe\\s+sucameli',
  'stefano\\s+campus','andrea\\s+ordonselli','paolo\\s+cavallini','davide\\s+gessa',
  'antonio\\s+cotroneo','gianluca\\s+massei','gianmarco\\s+alberti','stefano\\s+costa',
  'roberta\\s+fagandini','roberto\\s+marzocchi','marco\\s+zanieri','stefano\\s+masera',
  'pierluigi\\s+de\\s+rosa','andrea\\s+fredduzzi','sarino\\s+alfonso\\s+grande',
  'alejandra\\s+duque\\s+ropero',
  // handle / username noti
  'totofiandaca','pigreco','gbvitrano'
];
