let linkAttuale = window.location.pathname.split("/").pop();

let linkHome = document.getElementById("link-home");
let linkGiochi = document.getElementById("link-giochi");
let linkTrofei = document.getElementById("link-trofei");

let links = [linkHome, linkGiochi, linkTrofei];

let boxAccount = document.getElementById("box-account");

document.getElementById("pulsante-account").addEventListener("click", mostraInfoAccount);

caricamento_navBar();

function mostraInfoAccount(){
  if (boxAccount.style.display === "none" || boxAccount.style.display === "") {
    boxAccount.style.display = "block";
  } else {
    boxAccount.style.display = "none";
  }
}

function caricamento_navBar(){
  links.forEach(link => {
    if (link && link.href.split("/").pop() === linkAttuale) {
      link.classList.add("attivo");
    }
  });
}

/*parte My games*/
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

bottoneAggiungi.addEventListener("click" , AggiungiVideogioco);
bottoneTempo.addEventListener("click", mostraTempo);
bottoneSingle.addEventListener("click", singlePlayer);
bottoneSalva.addEventListener("click", salvaLocale);

function AggiungiVideogioco(){
    if(casellaNomeVideogioco.value == "" || casellaDataInizio.value == "" || casellaOreGiocate.value == ""){
        alert("ERRORE: riempire tutti i campi");
    }else if(trovaVideogioco(casellaNomeVideogioco.value) != -1){
        alert("ERRORE: videogioco gia' inserito");
        casellaNomeVideogioco.value = "";
        casellaDataInizio.value = "";
        casellaModalita.value = "Single Player";
        casellaOreGiocate.value = "";
    }else{
        let videogioco = {
            nome: casellaNomeVideogioco.value,
            data: casellaDataInizio.value,
            modalita: casellaModalita.value,
            tempo: parseInt(casellaOreGiocate.value)
        }

        listaVideogiochi.push(videogioco);

        corpoTabella.innerHTML = "";
        for(let i = 0;i < listaVideogiochi.length;i++){
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

            bottoneEliminaVideogioco.addEventListener("click", function() {
                let indice = trovaVideogioco(tdNome.innerText);
    
                if (indice !== -1) {
                    listaVideogiochi.splice(indice, 1);
                }
    
                if(listaVideogiochi.length == 0){
                    eliminaTutto();
                } else {
                    tr.remove();
                    pNumVideogiochi.innerText = listaVideogiochi.length;
                }
            });
        }

        if(listaVideogiochi.length == 0){
            casellaNomeVideogioco.value = "";
            casellaDataInizio.value = "";
            casellaModalita.value = "Single Player";
            casellaOreGiocate.value = "";
            return;
        }

        let trFinale = document.createElement("tr"); 
        let tdBottone = document.createElement("td");
        tdBottone.colSpan = "5";
        let bottoneEliminaTutto = document.createElement("button");
        bottoneEliminaTutto.innerText = "Elimina Tutto";
        bottoneEliminaTutto.id = "btnEliminaTutto";
        bottoneEliminaTutto.addEventListener("click", eliminaTutto);

        corpoTabella.appendChild(trFinale);
        trFinale.appendChild(tdBottone);
        tdBottone.appendChild(bottoneEliminaTutto);

        pNumVideogiochi.innerText = listaVideogiochi.length;

        casellaNomeVideogioco.value = "";
        casellaDataInizio.value = "";
        casellaModalita.value = "Single Player";
        casellaOreGiocate.value = "";
    }
}

function trovaVideogioco(nome){
    for(let i = 0;i < listaVideogiochi.length;i++){
        if(listaVideogiochi[i].nome == nome){
            return i;
        }
    }
    return -1;
}

function eliminaTutto(){
    corpoTabella.innerHTML = "";
    listaVideogiochi = [];
    pNumVideogiochi.innerText = "0";

    let tr1 = document.createElement("tr");
    let td1 = document.createElement("td");
    tr1.classList.add("riga-vuota");
    td1.colSpan = "5";
    td1.innerText = "Nessun videogioco registrato. Aggiungi il tuo primo gioco!";

    corpoTabella.appendChild(tr1);
    tr1.appendChild(td1);
}

function mostraTempo(){
    let oreTotali = tempoGiocato();

    let modal = document.createElement("div");
    modal.className = "modal";
    modal.tabIndex = "-1";
    document.body.appendChild(modal);

    let posizioneModal = document.createElement("div");
    posizioneModal.classList.add("modal-dialog", "modal-dialog-centered");
    modal.appendChild(posizioneModal);      
    
    let divContent = document.createElement("div");
    divContent.classList.add("modal-content");
    divContent.classList.add("bodyModal");
    posizioneModal.appendChild(divContent);
    
    let h2Modal = document.createElement("h2"); 
    h2Modal.classList.add("h2Modal");
    h2Modal.innerText = "TEMPO TOTALE GIOCATO";
    divContent.appendChild(h2Modal);

    let pModal = document.createElement("p");
    pModal.id = "pModal";
    pModal.innerText = oreTotali + " ore";
    divContent.appendChild(pModal);

    let buttonChiudi = document.createElement("button");
    buttonChiudi.classList.add("btnChiudi");
    buttonChiudi.type = "button";
    buttonChiudi.dataset.bsDismiss = "modal";
    buttonChiudi.innerText = "Chiudi";
    divContent.appendChild(buttonChiudi);

    // Inizializziamo e mostriamo il modal con le librerie di Bootstrap
    let istanzaBootstrap = new bootstrap.Modal(modal);
    istanzaBootstrap.show();

    // Quando l'utente chiude il modal, lo eliminiamo del tutto dal DOM per non lasciare spazzatura
    modal.addEventListener('hidden.bs.modal', function () {
        modal.remove();
    });
}

function tempoGiocato(){
    let totale = 0;

    for(let i = 0;i < listaVideogiochi.length;i++){
        totale += listaVideogiochi[i].tempo;
    }

    return totale;
}

function singlePlayer(){
    let modal = document.createElement("div");
    modal.className = "modal";
    modal.tabIndex = "-1";
    document.body.appendChild(modal);

    let posizioneModal = document.createElement("div");
    posizioneModal.classList.add("modal-dialog", "modal-dialog-centered");
    modal.appendChild(posizioneModal);
    
    let divContent = document.createElement("div");
    divContent.classList.add("modal-content");
    divContent.classList.add("bodyModal");
    posizioneModal.appendChild(divContent);

    let h2Modal = document.createElement("h2");
    h2Modal.classList.add("h2Modal");
    h2Modal.innerText = "GIOCHI SINGLE PLAYER";
    divContent.appendChild(h2Modal);

    let pModal = document.createElement("p");
    pModal.id = "pModalSingle";
    pModal.innerText = "hai giocato a ";
    if(contaSinglePlayer().length == 1){
        pModal.innerText += "1 gioco single player";
    }else{
        pModal.innerText += contaSinglePlayer().length + " giochi single player";
    }
    divContent.appendChild(pModal);

    let listaSinglePlayer = contaSinglePlayer();

    for(let i = 0;i < listaSinglePlayer.length;i++){
        let divGiocoSingle = document.createElement("div");
        divGiocoSingle.classList.add("divGiocoSingle");
        divContent.appendChild(divGiocoSingle);

        let pNomeGioco = document.createElement("p");
        pNomeGioco.classList.add("pNomeGioco");
        pNomeGioco.innerText = listaSinglePlayer[i].nome;
        divGiocoSingle.appendChild(pNomeGioco);

        let pInfo = document.createElement("p");
        pInfo.classList.add("pInfo");
        pInfo.innerText = listaSinglePlayer[i].tempo + "h - iniziato il " + listaSinglePlayer[i].data;
        divGiocoSingle.appendChild(pInfo);
    }

    let buttonChiudi = document.createElement("button");
    buttonChiudi.classList.add("btnChiudi");
    buttonChiudi.type = "button";
    buttonChiudi.dataset.bsDismiss = "modal";
    buttonChiudi.innerText = "Chiudi";
    divContent.appendChild(buttonChiudi);

    let istanzaBootstrap = new bootstrap.Modal(modal);
    istanzaBootstrap.show();

    // Quando l'utente chiude il modal, lo eliminiamo del tutto dal DOM per non lasciare spazzatura
    modal.addEventListener('hidden.bs.modal', function () {
        modal.remove();
    });
}

function contaSinglePlayer(){
    let listaGiochiSingle = [];

    for(let i = 0;i < listaVideogiochi.length;i++){
        if(listaVideogiochi[i].modalita == "Single Player"){
            listaGiochiSingle.push(listaVideogiochi[i]);
        }
    }

    return listaGiochiSingle;
}


function salvaLocale(){

}