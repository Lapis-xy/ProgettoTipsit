// ══════════════════════════════════════════
//  GAME VAULT — myGames.js
// ══════════════════════════════════════════

let casellaNomeVideogioco = document.getElementById("inputNomeVideogioco");
let casellaDataInizio = document.getElementById("inputDataInizio");
let casellaModalita = document.getElementById("selectModalita");
let casellaOreGiocate = document.getElementById("inputOreGiocate");
let bottoneAggiungi = document.getElementById("btnAggiungi");
let listaVideogiochi = [];
let corpoTabella = document.getElementById("contenutoTabella");
let pNumVideogiochi = document.getElementById("pNumeroVideogiochi");
let bottoneTempo = document.getElementById("btnTempo");
let bottoneSingle = document.getElementById("btnSingle");
let bottoneSalva = document.getElementById("btnSalva");
let parModal = document.getElementById("pModal");
let parModalSingle = document.getElementById("pModalSingle");
let divBodyTempo = document.getElementById("divBodyTempo");
let divBodySingle = document.getElementById("divBodySingle");

caricaLocale();

bottoneAggiungi.addEventListener("click", AggiungiVideogioco);
bottoneTempo.addEventListener("click", mostraTempo);
bottoneSingle.addEventListener("click", singlePlayer);
bottoneSalva.addEventListener("click", salvaLocale);

function AggiungiVideogioco() {
    if (casellaNomeVideogioco.value == "" || casellaDataInizio.value == "" || casellaOreGiocate.value == "" || Number(casellaOreGiocate.value) <= 0) {
        if (Number(casellaOreGiocate.value) <= 0) {
            alert("ERRORE: inserisci un numero positivo");
        } else {
            alert("ERRORE: riempire tutti i campi");
        }
    } else if (trovaVideogioco(casellaNomeVideogioco.value) != -1) {
        alert("ERRORE: videogioco gia' inserito");
        casellaNomeVideogioco.value = "";
        casellaDataInizio.value = "";
        casellaModalita.value = "Single Player";
        casellaOreGiocate.value = "";
    } else {
        let videogioco = {
            nome: casellaNomeVideogioco.value,
            data: formattaData(casellaDataInizio.value),
            modalita: casellaModalita.value,
            tempo: Number(casellaOreGiocate.value)
        }

        listaVideogiochi.push(videogioco);

        aggiornaTabella();

        casellaNomeVideogioco.value = "";
        casellaDataInizio.value = "";
        casellaModalita.value = "Single Player";
        casellaOreGiocate.value = "";
    }
}

function formattaData(data) {
    let campi = data.split("-");
    return campi[2] + "-" + campi[1] + "-" + campi[0];
}

function trovaVideogioco(nome) {
    for (let i = 0; i < listaVideogiochi.length; i++) {
        if (listaVideogiochi[i].nome.toLowerCase() == nome.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

function eliminaTutto() {
    listaVideogiochi = [];
    salvaLocale();
    aggiornaTabella();
}

function mostraTempo() {
    let oreTotali = tempoGiocato();

    parModal.innerText = oreTotali + " ore";
}

function tempoGiocato() {
    let totale = 0;

    for (let i = 0; i < listaVideogiochi.length; i++) {
        totale += listaVideogiochi[i].tempo;
    }

    return totale;
}

function singlePlayer() {
    parModalSingle.innerText = "hai giocato a ";
    if (contaSinglePlayer().length == 0) {
        parModalSingle.innerText += "0 giochi single player";
    } else if (contaSinglePlayer().length == 1) {
        parModalSingle.innerText += "1 gioco single player";
    } else {
        parModalSingle.innerText += contaSinglePlayer().length + " giochi single player";
    }

    divBodySingle.innerHTML = "";

    let listaSinglePlayer = contaSinglePlayer();

    for (let i = 0; i < listaSinglePlayer.length; i++) {
        let divGiocoSingle = document.createElement("div");
        divGiocoSingle.classList.add("divGiocoSingle");
        divBodySingle.appendChild(divGiocoSingle);

        let pNomeGioco = document.createElement("p");
        pNomeGioco.classList.add("pNomeGioco");
        pNomeGioco.innerText = listaSinglePlayer[i].nome;
        divGiocoSingle.appendChild(pNomeGioco);

        let pInfo = document.createElement("p");
        pInfo.classList.add("pInfo");
        pInfo.innerText = listaSinglePlayer[i].tempo + "h - iniziato il " + listaSinglePlayer[i].data;
        divGiocoSingle.appendChild(pInfo);
    }
}

function contaSinglePlayer() {
    let listaGiochiSingle = [];

    for (let i = 0; i < listaVideogiochi.length; i++) {
        if (listaVideogiochi[i].modalita == "Single Player") {
            listaGiochiSingle.push(listaVideogiochi[i]);
        }
    }

    return listaGiochiSingle;
}

function salvaLocale() {
    localStorage.setItem("listavideogiochi", JSON.stringify(listaVideogiochi));
}

function caricaLocale() {
    let dati = localStorage.getItem("listavideogiochi");

    if (dati) {
        listaVideogiochi = JSON.parse(dati);
    } else {
        listaVideogiochi = [];
    }

    aggiornaTabella();
}

function aggiornaTabella() {
    corpoTabella.innerHTML = "";

    if (listaVideogiochi.length == 0) {
        let tr1 = document.createElement("tr");
        let td1 = document.createElement("td");

        tr1.classList.add("riga-vuota");
        td1.colSpan = "5";
        td1.innerText = "Nessun videogioco registrato. Aggiungi il tuo primo gioco!";

        corpoTabella.appendChild(tr1);
        tr1.appendChild(td1);

        pNumVideogiochi.innerText = "0";

        return;
    }

    for (let i = 0; i < listaVideogiochi.length; i++) {
        let tr = document.createElement("tr");

        let tdNome = document.createElement("td");
        tdNome.classList.add("nomeVideogioco");
        tdNome.innerText = listaVideogiochi[i].nome;

        let tdData = document.createElement("td");
        tdData.innerText = listaVideogiochi[i].data;
        tdData.classList.add("data");

        let tdModalita = document.createElement("td");
        tdModalita.classList.add("modalita");
        tdModalita.innerText = listaVideogiochi[i].modalita;

        let tdTempo = document.createElement("td");
        tdTempo.innerText = listaVideogiochi[i].tempo;
        tdTempo.classList.add("durata");

        let tdAzioni = document.createElement("td");

        let bottoneEliminaVideogioco = document.createElement("button");
        bottoneEliminaVideogioco.classList.add("bottoneElimina");
        bottoneEliminaVideogioco.innerText = "Elimina";

        corpoTabella.appendChild(tr);
        tr.appendChild(tdNome);
        tr.appendChild(tdData);
        tr.appendChild(tdModalita);
        tr.appendChild(tdTempo);
        tr.appendChild(tdAzioni);
        tdAzioni.appendChild(bottoneEliminaVideogioco);

        bottoneEliminaVideogioco.addEventListener("click", function () {
            listaVideogiochi.splice(i, 1);
            salvaLocale();
            aggiornaTabella();
        });
    }

    pNumVideogiochi.innerText = listaVideogiochi.length;

    let trFinale = document.createElement("tr");
    let tdBottone = document.createElement("td");

    tdBottone.colSpan = "5";

    let bottoneEliminaTutto = document.createElement("button");
    bottoneEliminaTutto.innerText = "Elimina Tutto";
    bottoneEliminaTutto.id = "btnEliminaTutto";

    bottoneEliminaTutto.addEventListener("click", eliminaTutto);

    tdBottone.appendChild(bottoneEliminaTutto);
    trFinale.appendChild(tdBottone);
    corpoTabella.appendChild(trFinale);
}
