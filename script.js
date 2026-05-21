let linkAttuale = window.location.pathname.split("/").pop();

let linkHome = document.getElementById("link-home");
let linkGiochi = document.getElementById("link-giochi");
let linkTrofei = document.getElementById("link-trofei");

links = [linkHome , linkGiochi , linkTrofei];


caricamento_navBar()












function caricamento_navBar(){

    links.forEach(link => {
        if(link.href.split("/").pop() == linkAttuale){
            link.classList.add("attivo")
        }
    });
}

