let listaVideogiochi = [];

window.onstorage = function (Event) {
    if (Event.key == "listaVideogiochi" || Event.key == "listavideogiochi" || Event.key == "clicBlindRun") {
        aggiornaTrofeiDaStorage();
    }
}

function ottieniVideogiochiSalvati() {
    let salvati = localStorage.getItem("listavideogiochi") || localStorage.getItem("listaVideogiochi");
    if (!salvati) {
        return [];
    }

    try {
        return JSON.parse(salvati) || [];
    } catch (errore) {
        console.warn(errore);
        return [];
    }
}

function ottieniClicBlindRun() {
    let valore = localStorage.getItem("clicBlindRun");
    if (!valore) {
        return 0;
    }
    return Number(valore) || 0;
}

function salvaClicBlindRun(clic) {
    localStorage.setItem("clicBlindRun", clic);
}

function analizzaNumero(valore) {
    let numero = Number(valore);
    return Number.isFinite(numero) ? numero : 0;
}

function ottieniOreGioco(gioco) {
    return (
        analizzaNumero(gioco.tempo) ||
        analizzaNumero(gioco.hours) ||
        analizzaNumero(gioco.playedHours) ||
        analizzaNumero(gioco.duration) ||
        analizzaNumero(gioco.hoursPlayed) ||
        0
    );
}

function eGiocoSingolo(gioco) {
    return gioco.modalita == "Single Player" ||
        gioco.modalita == "single player" ||
        gioco.modalita == "Single player" ||
        gioco.modalita == "single";
}

function haSpeedRun(gioco) {
    let ore = ottieniOreGioco(gioco);
    return ore > 0 && ore <= 5;
}

function aggiornaTrofeiDaStorage() {
    listaVideogiochi = ottieniVideogiochiSalvati();

    let oreTotali = 0;
    for (let i = 0; i < listaVideogiochi.length; i++) {
        oreTotali += ottieniOreGioco(listaVideogiochi[i]);
    }

    let conteggioGiocatoreSingolo = 0;
    for (let i = 0; i < listaVideogiochi.length; i++) {
        if (eGiocoSingolo(listaVideogiochi[i])) {
            conteggioGiocatoreSingolo++;
        }
    }

    let haCorsaVeloce = false;
    for (let i = 0; i < listaVideogiochi.length; i++) {
        if (haSpeedRun(listaVideogiochi[i])) {
            haCorsaVeloce = true;
            break;
        }
    }

    let clicBlindRun = ottieniClicBlindRun();

    let trofei = [
        { id: 1, attuale: Math.min(clicBlindRun, 5), totale: 5 },
        { id: 2, attuale: Math.min(listaVideogiochi.length, 50), totale: 50 },
        { id: 3, attuale: Math.min(listaVideogiochi.length, 20), totale: 20 },
        { id: 4, attuale: Math.min(oreTotali, 10), totale: 10 },
        { id: 5, attuale: Math.min(oreTotali, 50), totale: 50 },
        { id: 6, attuale: Math.min(oreTotali, 100), totale: 100 },
        { id: 7, attuale: Math.min(conteggioGiocatoreSingolo, 3), totale: 3 },
        { id: 8, attuale: haCorsaVeloce ? 1 : 0, totale: 1 },
        { id: 9, attuale: Math.min(oreTotali, 500), totale: 500 }
    ];

    for (let i = 0; i < trofei.length; i++) {
        aggiornaTrofeo(trofei[i].id, trofei[i].attuale, trofei[i].totale);
    }
    aggiornaCompletamentoGenerale(trofei);
}

function aggiornaCompletamentoGenerale(trofei) {
    let barraGenerale = document.getElementById("barra");
    let testoGenerale = document.getElementById("percentuale");

    if (!barraGenerale || !testoGenerale) {
        return;
    }

    let trofeiTotali = trofei.length;
    let trofeiCompletati = 0;
    for (let i = 0; i < trofei.length; i++) {
        if (trofei[i].attuale >= trofei[i].totale) {
            trofeiCompletati++;
        }
    }
    let percentualeCompletamento = Math.round((trofeiCompletati / trofeiTotali) * 100);

    barraGenerale.style.width = percentualeCompletamento + "%";
    testoGenerale.textContent = percentualeCompletamento + "% Completato";
}

function aggiornaTrofeo(id, attuale, totale) {
    let elementoContatore = document.getElementById("contatore-" + id);
    let elementoBarra = document.getElementById("barra-" + id);

    if (elementoContatore && elementoBarra) {
        elementoContatore.textContent = attuale + "/" + totale;
        let percentuale = (attuale / totale) * 100;
        elementoBarra.style.width = percentuale + "%";
    }
}

function gestisciReindirizzamentoSegreto() {
    let schedaBlindRun = document.getElementById("trofeo-blind-run");
    if (!schedaBlindRun) {
        return;
    }

    schedaBlindRun.addEventListener("click", function () {
        let conteggioClic = ottieniClicBlindRun();
        conteggioClic += 1;
        salvaClicBlindRun(conteggioClic);

        aggiornaTrofeiDaStorage();

        if (conteggioClic >= 5) {
            window.location.href = "video.html";
        }
    });
}

function filtraPerRarita() {
    let caselleFiltro = document.querySelectorAll('.filtri-rarita input[type="checkbox"]');
    let schede = document.querySelectorAll('[data-rarita]');
    let raritaSelezionate = [];

    for (let i = 0; i < caselleFiltro.length; i++) {
        if (caselleFiltro[i].checked) {
            raritaSelezionate.push(caselleFiltro[i].value);
        }
    }

    for (let i = 0; i < schede.length; i++) {
        let scheda = schede[i];
        if (raritaSelezionate.length == 0) {
            scheda.classList.remove('hidden');
        } else {
            let trovata = false;
            for (let j = 0; j < raritaSelezionate.length; j++) {
                if (raritaSelezionate[j] == scheda.dataset.rarita) {
                    trovata = true;
                    break;
                }
            }
            if (trovata) {
                scheda.classList.remove('hidden');
            } else {
                scheda.classList.add('hidden');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let caselleFiltro = document.querySelectorAll('.filtri-rarita input[type="checkbox"]');

    for (let i = 0; i < caselleFiltro.length; i++) {
        caselleFiltro[i].addEventListener('change', filtraPerRarita);
    }

    aggiornaTrofeiDaStorage();
    gestisciReindirizzamentoSegreto();
});
