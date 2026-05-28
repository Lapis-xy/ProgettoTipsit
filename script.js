let nomeUtente         = document.getElementById("nome-utente");
let nomeUtenteAccount  = document.getElementById("nome-utente-account");
let contenitorePopup   = document.getElementById("contenitore-popup");
let inputTesto         = document.getElementById("input-testo");
let counter            = document.getElementById("conteggio");
let btnInvia           = document.getElementById("btn-invia");
let msgErrore          = document.getElementById("msg-errore");


controllaLocalstorage();
aggiornaInfoGiocate();

if (inputTesto && counter) {
    inputTesto.addEventListener("input", aggiornaContatore);
}

btnInvia?.addEventListener("click", salvaDati);

window.addEventListener("storage", function (e) {
    if (e.key == "listavideogiochi" || e.key == "listaVideogiochi") {
        aggiornaInfoGiocate();
    }
});

function cambiaNomeUtente() {
    let username = localStorage.getItem("username") || "Player One";
    if (nomeUtente)        nomeUtente.textContent        = username;
    if (nomeUtenteAccount) nomeUtenteAccount.textContent = username;
}

function controllaLocalstorage() {
    let username = localStorage.getItem("username");
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

function aggiornaInfoGiocate() {
    let raw  = localStorage.getItem("listavideogiochi") || localStorage.getItem("listaVideogiochi") || "[]";
    let lista = JSON.parse(raw);

    let nGiochi = lista.length;
    let nOre    = lista.reduce((acc, g) => acc + (parseFloat(g.tempo) || 0), 0);
    let nSolo   = lista.filter(g =>
        g.modalita == "Single Player" ||
        g.modalita == "single player" ||
        g.modalita == "single"
    ).length;
    let nOnline = lista.filter(g =>
        g.modalita == "Multiplayer" ||
        g.modalita == "multiplayer" ||
        g.modalita == "online"
    ).length;

    let nTrofei = calcolaTrofei(lista);

    let mappa = [
        { id: "info-giocate-giochi",  valore: nGiochi  },
        { id: "info-giocate-ore",     valore: nOre     },
        { id: "info-giocate-solo",    valore: nSolo    },
        { id: "info-giocate-online",  valore: nOnline  },
        { id: "info-giocate-trofei",  valore: nTrofei  },
    ];

    mappa.forEach(({ id, valore }) => {
        let box = document.getElementById(id);
        if (!box) return;
        let campo = box.querySelector(".info-giocate-valore");
        if (campo) campo.textContent = valore;
    });
}

/**
 * Calcola quanti achievement sono sbloccati (stessa logica di navbar.js)
 * per mostrare il contatore trofei nella home.
 */
function calcolaTrofei(lista) {
    let totalHours        = lista.reduce((s, g) => s + (parseFloat(g.tempo) || 0), 0);
    let singlePlayerCount = lista.filter(g =>
        g.modalita == "Single Player" || g.modalita == "single player"
    ).length;
    let hasFastRun = lista.some(g => {
        let ore = parseFloat(g.tempo) || 0;
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