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
    if (Event.key == "listaVideogiochi" || Event.key == "listavideogiochi") {
        updateAchievementsFromStorage();
    }
}

function getSavedVideogiochi() {
    const saved = localStorage.getItem("listavideogiochi") || localStorage.getItem("listaVideogiochi");
    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved) || [];
    } catch (error) {
        console.warn("Impossibile leggere listaVideogiochi da localStorage", error);
        return [];
    }
}

function parseNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function getGameHours(game) {
    return (
        parseNumber(game.tempo) ||
        parseNumber(game.hours) ||
        parseNumber(game.playedHours) ||
        parseNumber(game.duration) ||
        parseNumber(game.hoursPlayed) ||
        0
    );
}

function isSinglePlayerGame(game) {
    return game.modalita === "Single Player" ||
           game.modalita === "single player" ||
           game.modalita === "Single player" ||
           game.modalita === "single" ||
           Boolean(game.singlePlayer || game.isSinglePlayer || game.is_single_player ||
                   (typeof game.mode === "string" && game.mode.toLowerCase().includes("single")));
}

function hasFirstBlood(game) {
    return Boolean(
        game.firstBlood ||
        game.firstAdvantage ||
        game.hasFirstBlood ||
        game.first_advantage ||
        game.first_win
    );
}

function hasSpeedRunner(game) {
    const completed = Boolean(game.completed || game.isCompleted || game.finished || game.completato);
    const hours = getGameHours(game);
    return completed && hours > 0 && hours <= 5;
}

function updateAchievementsFromStorage() {
    listaVideogiochi = getSavedVideogiochi();

    const totalHours = listaVideogiochi.reduce((sum, game) => sum + getGameHours(game), 0);
    const singlePlayerCount = listaVideogiochi.filter(isSinglePlayerGame).length;
    const hasFirstAdvantage = listaVideogiochi.some(hasFirstBlood);
    const hasFastRun = listaVideogiochi.some(hasSpeedRunner);

    const achievements = [
        { id: 1, current: hasFirstAdvantage ? 1 : 0, total: 1 },
        { id: 2, current: Math.min(listaVideogiochi.length, 50), total: 50 },
        { id: 3, current: Math.min(listaVideogiochi.length, 20), total: 20 },
        { id: 4, current: Math.min(totalHours, 10), total: 10 },
        { id: 5, current: Math.min(totalHours, 50), total: 50 },
        { id: 6, current: Math.min(totalHours, 100), total: 100 },
        { id: 7, current: Math.min(singlePlayerCount, 3), total: 3 },
        { id: 8, current: hasFastRun ? 1 : 0, total: 1 },
        { id: 9, current: Math.min(totalHours, 500), total: 500 }
    ];

    achievements.forEach(a => updateAchievement(a.id, a.current, a.total));
    updateOverallCompletion(achievements);
}

function updateOverallCompletion(achievements) {
    const overallBar = document.getElementById("barra");
    const overallText = document.getElementById("percentuale");

    if (!overallBar || !overallText) {
        return;
    }

    const totalAchievements = achievements.length;
    const completedAchievements = achievements.filter(a => a.current >= a.total).length;
    const completedPercent = Math.round((completedAchievements / totalAchievements) * 100);

    overallBar.style.width = completedPercent + "%";
    overallText.textContent = completedPercent + "% Completato";
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

function setupBlindRunRedirect() {
    const blindRunCard = document.getElementById("blind-run-achievement");
    if (!blindRunCard) {
        return;
    }

    let clickCount = 0;
    blindRunCard.addEventListener("click", () => {
        clickCount += 1;
        if (clickCount >= 5) {
            window.location.href = "video.html";
        }
    });
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

    updateAchievementsFromStorage();
    setupBlindRunRedirect();
});



