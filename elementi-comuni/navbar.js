let linkAttuale = window.location.pathname.split("/").pop();

let linkHome = document.getElementById("link-home");
let linkGiochi = document.getElementById("link-giochi");
let linkTrofei = document.getElementById("link-trofei");

links = [linkHome , linkGiochi , linkTrofei];

let pulsanteAccount = document.getElementById("pulsante-account");
let boxAccount = document.getElementById("box-account");


caricamento_navBar()

if (pulsanteAccount && boxAccount) {
    pulsanteAccount.addEventListener("click" , MostraInfoAccount);
}












function caricamento_navBar(){

    links.forEach(link => {
        if(link.href.split("/").pop() == linkAttuale){
            link.classList.add("attivo")
        }
    });
}

function MostraInfoAccount(){

    if(boxAccount.style.display == "none"){
        boxAccount.style.display = "block";
    }else{
        boxAccount.style.display = "none";
    }


}

