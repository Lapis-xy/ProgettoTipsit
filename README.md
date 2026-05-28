# Progetto Game Vault

Game Vault è un'applicazione web progettata per i videogiocatori che desiderano tracciare i propri progressi, gestire la propria libreria di giochi e sbloccare obiettivi. Il progetto è sviluppato interamente con HTML, CSS e JavaScript vanilla (puro) e utilizza il `localStorage` del browser per salvare i dati utente in locale.

## Funzionalità principali

* **Dashboard Personalizzata**: Una home page che saluta l'utente per nome e mostra un riepilogo delle statistiche di gioco (totale giochi, ore giocate e trofei sbloccati).
* **Gestione dei Giochi**: Permette di aggiungere titoli alla libreria specificando nome, data di inizio, modalità (Single Player/Multiplayer) e ore di gioco. La lista è gestita tramite una tabella chiara.
* **Sistema di Trofei**: Un sistema di obiettivi con diverse rarità (Bronzo, Argento, Oro, Platino) che si sbloccano automaticamente al raggiungimento di determinati traguardi.
* **Filtro per Rarità**: La pagina dei trofei permette di filtrare gli obiettivi in base al loro livello di rarità.
* **Assistente AI Gemini**: Una chat integrata alimentata dalle API di Google Gemini. Analizza la libreria dell'utente per suggerire nuovi giochi personalizzati.
* **Contenuto Segreto**: Un easter egg nascosto nel sistema dei trofei che reindirizza l'utente a una pagina video segreta al soddisfacimento di una condizione specifica.
* **Salvataggio Locale**: Tutti i dati (nome utente, lista giochi, progressi) rimangono salvati nel `localStorage` del browser anche dopo la chiusura della pagina.
* **Design Responsivo**: L'interfaccia è sviluppata con Bootstrap 5 e CSS personalizzato per adattarsi perfettamente sia a schermi desktop che a dispositivi mobile.

## Pagine del Sito

### Home (`home.html`)
La pagina di atterraggio principale. Mostra un popup iniziale per l'inserimento del nome utente, una dashboard con le statistiche generali e le schede di navigazione rapida verso le altre sezioni.

### I Miei Giochi (`myGames.html`)
Il fulcro della gestione della libreria. Include il modulo (form) per inserire nuovi videogiochi e la tabella con l'elenco completo, con opzioni per eliminare singoli titoli o svuotare l'intera lista.

### Bacheca dei Trofei (`trofei.html`)
Mostra la collezione degli obiettivi sbloccabili. Ogni scheda trofeo presenta titolo, descrizione, rarità e una barra di avanzamento che si aggiorna in tempo reale in base ai giochi inseriti.

### Pagina Video Segreta (`video.html`)
Una pagina nascosta accessibile esclusivamente cliccando più volte di seguito sul trofeo "BLIND RUN" all'interno della bacheca.

## Tecnologie Utilizzate

* **Frontend**: HTML5, CSS3, JavaScript (ES6)
* **Framework/Librerie**: Bootstrap 5
* **API**: Google Gemini API
* **Archiviazione**: Browser Local Storage

## Guida all'Installazione Locale

Per avviare e testare il progetto sul tuo computer, segui questi passaggi:

1. **Clona la repository git:**
   ```sh
   git clone https://github.com
   ```
2. **Entra nella cartella del progetto:**
   ```sh
   cd ProgettoTipsit
   ```
3. **Apri il file `home.html` nel browser:**
   Puoi fare doppio clic sul file oppure utilizzare un'estensione di server locale (come *Live Server* su VS Code).

### Configurazione dell'Assistente AI Gemini
Per il corretto funzionamento della chat è necessaria una chiave API valida. La chiave va inserita direttamente nel file di configurazione condiviso:

```javascript
// All'interno del file navbar-shared.js
let CHIAVE_API_GEMINI = "INSERISCI_QUI_LA_TUA_API_KEY";
```
