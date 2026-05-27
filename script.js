// ══════════════════════════════════════════
//  GAME VAULT — script.js (Home)
// ══════════════════════════════════════════

// ── Riferimenti DOM ────────────────────────
const nomeUtente         = document.getElementById("nome-utente");
const nomeUtenteAccount  = document.getElementById("nome-utente-account");
const contenitorePopup   = document.getElementById("contenitore-popup");
const inputTesto         = document.getElementById("input-testo");
const counter            = document.getElementById("conteggio");
const btnInvia           = document.getElementById("btn-invia");
const msgErrore          = document.getElementById("msg-errore");

// ── Init ───────────────────────────────────
controllaLocalstorage();
aggiornaInfoGiocate();

if (inputTesto && counter) {
    inputTesto.addEventListener("input", aggiornaContatore);
}

// ── Event listeners ───────────────────────
btnInvia?.addEventListener("click", salvaDati);

// Aggiornamento real-time da altre schede
window.addEventListener("storage", function (e) {
    if (e.key === "listavideogiochi" || e.key === "listaVideogiochi") {
        aggiornaInfoGiocate();
    }
});

// ── Funzioni account ───────────────────────
function cambiaNomeUtente() {
    const username = localStorage.getItem("username") || "Player One";
    if (nomeUtente)        nomeUtente.textContent        = username;
    if (nomeUtenteAccount) nomeUtenteAccount.textContent = username;
}

function controllaLocalstorage() {
    const username = localStorage.getItem("username");
    if (username) {
        contenitorePopup?.classList.remove("visibile");
        cambiaNomeUtente();
        return true;
    }
    contenitorePopup?.classList.add("visibile");
    return false;
}

function salvaDati() {
    if (!inputTesto) return;
    if (inputTesto.value.trim().length >= 3) {
        localStorage.setItem("username", inputTesto.value.trim());
        contenitorePopup?.classList.remove("visibile");
        cambiaNomeUtente();
        if (msgErrore) msgErrore.style.display = "none";
    } else {
        if (msgErrore) msgErrore.style.display = "block";
    }
}

function aggiornaContatore() {
    if (counter && inputTesto) {
        counter.textContent = inputTesto.value.length + "/12";
    }
}

// ── Statistiche ───────────────────────────
function aggiornaInfoGiocate() {
    // legge da entrambe le chiavi per compatibilità con myGames.js
    const raw  = localStorage.getItem("listavideogiochi") || localStorage.getItem("listaVideogiochi") || "[]";
    const lista = JSON.parse(raw);

    // Calcola valori dalla struttura salvata da myGames.js:
    // ogni gioco ha: { nome, data, modalita, tempo }
    const nGiochi = lista.length;
    const nOre    = lista.reduce((acc, g) => acc + (parseFloat(g.tempo) || 0), 0);
    const nSolo   = lista.filter(g =>
        g.modalita === "Single Player" ||
        g.modalita === "single player" ||
        g.modalita === "single"
    ).length;
    const nOnline = lista.filter(g =>
        g.modalita === "Multiplayer" ||
        g.modalita === "multiplayer" ||
        g.modalita === "online"
    ).length;

    // Trofei: contati da navbar.js in base agli achievement sbloccati
    const nTrofei = calcolaTrofei(lista);

    // Mappa id → valore
    const mappa = [
        { id: "info-giocate-giochi",  valore: nGiochi  },
        { id: "info-giocate-ore",     valore: nOre     },
        { id: "info-giocate-solo",    valore: nSolo    },
        { id: "info-giocate-online",  valore: nOnline  },
        { id: "info-giocate-trofei",  valore: nTrofei  },
    ];

    mappa.forEach(({ id, valore }) => {
        const box = document.getElementById(id);
        if (!box) return;
        const campo = box.querySelector(".info-giocate-valore");
        if (campo) campo.textContent = valore;
    });
}

/**
 * Calcola quanti achievement sono sbloccati (stessa logica di navbar.js)
 * per mostrare il contatore trofei nella home.
 */
function calcolaTrofei(lista) {
    const totalHours        = lista.reduce((s, g) => s + (parseFloat(g.tempo) || 0), 0);
    const singlePlayerCount = lista.filter(g =>
        g.modalita === "Single Player" || g.modalita === "single player"
    ).length;
    const hasFastRun = lista.some(g => {
        const ore = parseFloat(g.tempo) || 0;
        return ore > 0 && ore <= 5;
    });

    let count = 0;
    if (lista.length >= 1)    count++; // first blood / qualsiasi gioco
    if (lista.length >= 50)   count++; // The Collector
    if (lista.length >= 20)   count++; // Hoarder
    if (totalHours >= 10)     count++; // Casual Player
    if (totalHours >= 50)     count++; // Dedicated
    if (totalHours >= 100)    count++; // Centurion
    if (singlePlayerCount >= 3) count++; // Solo Hero
    if (hasFastRun)           count++; // Speed Runner
    if (totalHours >= 500)    count++; // Marathon Runner

    return count;
}