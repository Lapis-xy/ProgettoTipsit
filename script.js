let linkAttuale = window.location.pathname.split("/").pop();

let linkHome = document.getElementById("link-home");
let linkGiochi = document.getElementById("link-giochi");
let linkTrofei = document.getElementById("link-trofei");

links = [linkHome , linkGiochi , linkTrofei];

let pulsanteAccount = document.getElementById("pulsante-account").addEventListener("click" , MostraInfoAccount); 
let boxAccount = document.getElementById("box-account");

let counter = document.getElementById("conteggio");
let inputTesto = document.getElementById("input-testo");
let btnInvia = document.getElementById("btn-invia").addEventListener("click" , salvaDati)
let contenitorePopup = document.getElementById("popup");
let divContenitorePopup = document.getElementsByClassName("contenitore-popup");
let nomeUtente = document.getElementById("nome-utente");
let nomeUtenteAccount = document.getElementById("nome-utente-account");
let btnUscita = document.getElementById("btn-uscita").addEventListener("click" , rimuoviLocalStorage);
let msgErrore = document.getElementById("msg-errore")


controllaLocalstorage()
caricamento_navBar()


if(inputTesto && counter){
    inputTesto.addEventListener("input", aggiornaContatore);
}




function rimuoviLocalStorage(){

    localStorage.clear();
    location.reload();


}

function cambiaNomeutente(){
        let username = localStorage.getItem("username");
        nomeUtente.textContent = username;
        nomeUtenteAccount.textContent = username;

}


function controllaLocalstorage(){
    let username = localStorage.getItem("username");
     if(username != null){
        divContenitorePopup[0].classList.remove("visibile");

        cambiaNomeutente();

        return true; 
    }

  
    divContenitorePopup[0].classList.add("visibile");
    return false;


}


function salvaDati(){
    
    if(inputTesto.value.length >= 3){
        localStorage.setItem("username" , inputTesto.value);
        divContenitorePopup[0].classList.remove("visibile")
        cambiaNomeutente();
    }else{
        msgErrore.style.display = "block";
    }

}


function aggiornaContatore(){

    let testo = inputTesto.value

    counter.textContent = testo.length + "/12"


}

function MostraInfoAccount(){

    if(boxAccount.style.display == "none"){
        boxAccount.style.display = "block";
    }else{
        boxAccount.style.display = "none";
    }


}



function caricamento_navBar(){

    links.forEach(link => {
        if(link.href.split("/").pop() == linkAttuale){
            link.classList.add("attivo")
        }
    });
}

