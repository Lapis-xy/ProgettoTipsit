let linkAttuale = window.location.pathname.split("/").pop();
let barra = document.getElementById("barra");
let testo = document.getElementById("testo");
let linkHome = document.getElementById("link-home");
let linkGiochi = document.getElementById("link-giochi");
let linkTrofei = document.getElementById("link-trofei");
let elemento = barra.width/12;
let listaVideogiochi = [];

links = [linkHome , linkGiochi , linkTrofei];


caricamento_navBar()

console.log(linkAttuale)

function caricamento_navBar(){

    links.forEach(link => {
        if(link.href.split("/").pop() == linkAttuale){
            link.classList.add("attivo")
        }
    });
}


// leggere la lista dei videogiochi da localStorage
window.onstorage = (Event) => {
    if(Event.key == "listaVideogiochi"){
        listaVideogiochi = JSON.parse(localStorage.getItem("listaVideogiochi"));
    }
}

function updateAchievement(id, current, total) {
    const countElement = document.getElementById(`count-${id}`);
    const barElement = document.getElementById(`bar-${id}`);
    
    if (countElement && barElement) {
        countElement.textContent = `${current}/${total}`;
        const percentage = (current / total) * 100;
        barElement.style.width = percentage + '%';
    }
}

// Funzione per filtrare le card in base alla rarity selezionata
function filterByRarity() {
    const checkboxes = document.querySelectorAll('.ranks input[type="checkbox"]');
    const cards = document.querySelectorAll('[data-rarity]');
    const selectedRarities = [];
    
    // Raccogli le rarità selezionate
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedRarities.push(checkbox.value);
        }
    });
    
    // Mostra/nascondi le card in base alle selezioni
    cards.forEach(card => {
        if (selectedRarities.length === 0) {
            // Se nessun filtro è selezionato, mostra tutte
            card.classList.remove('hidden');
        } else if (selectedRarities.includes(card.dataset.rarity)) {
            // Se la rarity della card è selezionata, mostrala
            card.classList.remove('hidden');
        } else {
            // Altrimenti, nascondila
            card.classList.add('hidden');
        }
    });
}

// Event listener per le checkbox
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.ranks input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterByRarity);
    });
});