document.addEventListener("DOMContentLoaded", function () {
    let linkAttuale = window.location.pathname.split("/").pop() || "home.html";
    let collegamenti = [
        document.getElementById("link-home"),
        document.getElementById("link-giochi"),
        document.getElementById("link-trofei")
    ];

    for (let i = 0; i < collegamenti.length; i++) {
        let link = collegamenti[i];
        if (link) {
            let href = link.getAttribute("href");
            if (href == linkAttuale || (linkAttuale == "" && href == "home.html")) {
                link.classList.add("attivo");
            } else {
                link.classList.remove("attivo");
            }
        }
    }

    let pulsanteAccount = document.getElementById("pulsante-account");
    let boxAccount = document.getElementById("box-account");
    let nomeUtenteAccount = document.getElementById("nome-utente-account");
    let pulsanteUscita = document.getElementById("btn-uscita");

    function aggiornaNomeAccount() {
        let nomeUtente = localStorage.getItem("username") || "Player One";
        if (nomeUtenteAccount) {
            nomeUtenteAccount.textContent = nomeUtente;
        }
    }

    aggiornaNomeAccount();

    window.addEventListener("storage", function (e) {
        if (e.key == "username") {
            aggiornaNomeAccount();
        }
    });

    if (pulsanteAccount && boxAccount) {
        pulsanteAccount.addEventListener("click", function (e) {
            e.stopPropagation();
            let eNascosto = boxAccount.style.display == "none" || boxAccount.style.display == "";
            boxAccount.style.display = eNascosto ? "flex" : "none";
        });

        document.addEventListener("click", function (e) {
            if (boxAccount.style.display == "flex") {
                if (!boxAccount.contains(e.target) && e.target != pulsanteAccount && !pulsanteAccount.contains(e.target)) {
                    boxAccount.style.display = "none";
                }
            }
        });
    }

    if (pulsanteUscita) {
        pulsanteUscita.addEventListener("click", function () {
            localStorage.clear();
            window.location.href = "home.html";
        });
    }

    let pulsanteAi = document.getElementById("pulsante-ai");
    let finestraChat = document.getElementById("gemini-chat");
    let corpoChat = document.querySelector(".corpo-chat");

    let CHIAVE_API_GEMINI = "AIzaSyC2a9C6TuMtQ3cK-dfsXoB6qfL0Iwzs_i8";

    if (pulsanteAi && finestraChat) {
        pulsanteAi.addEventListener("click", function (e) {
            e.stopPropagation();

            let siStaAprendo = !finestraChat.classList.contains("gemini-chat-attiva");
            finestraChat.classList.toggle("gemini-chat-attiva");

            if (siStaAprendo) {
                consigliaGiochi();
            }
        });

        finestraChat.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        document.addEventListener("click", function () {
            if (finestraChat.classList.contains("gemini-chat-attiva")) {
                finestraChat.classList.remove("gemini-chat-attiva");
            }
        });
    }

    function aggiungiMessaggioChat(testo, mittente) {
        if (!corpoChat) return;
        let divMessaggio = document.createElement("p");
        let classeMittente = mittente == "system" ? "messaggio-sistema" : "messaggio-ia";
        divMessaggio.className = "messaggio-chat " + classeMittente;
        divMessaggio.textContent = testo;
        corpoChat.appendChild(divMessaggio);
        corpoChat.scrollTop = corpoChat.scrollHeight;
    }

    function consigliaGiochi() {
        if (!corpoChat) return;

        corpoChat.innerHTML = "";

        let datiLocalStorage = localStorage.getItem("listavideogiochi") || "[]";
        let giochiSalvati = JSON.parse(datiLocalStorage);

        if (giochiSalvati.length == 0) {
            aggiungiMessaggioChat("Non hai ancora inserito nessun gioco! Vai nella sezione \"My Games\" e aggiungi almeno un gioco per ricevere consigli da Gemini.", "system");
            return;
        }

        aggiungiMessaggioChat("Gemini sta analizzando i tuoi giochi salvati...", "system");

        let messaggioCaricamento = document.createElement("p");
        messaggioCaricamento.className = "messaggio-chat messaggio-ia messaggio-caricamento";
        messaggioCaricamento.textContent = "Ricerca consigli in corso...";
        corpoChat.appendChild(messaggioCaricamento);
        corpoChat.scrollTop = corpoChat.scrollHeight;

        let contestoGiochi = "Ecco la lista dei miei giochi salvati:\n";
        for (let i = 0; i < giochiSalvati.length; i++) {
            contestoGiochi += "- " + giochiSalvati[i].nome + " (" + giochiSalvati[i].tempo + " ore giocate, modalità: " + giochiSalvati[i].modalita + ")\n";
        }

        let istruzioniSistema = "Sei Gemini AI, un assistente virtuale per consigliare videogiochi.\n" +
            "Ecco la lista dei miei giochi salvati:\n" + contestoGiochi + "\n" +
            "Consiglia esclusivamente tre videogiochi simili a quelli presenti nella mia lista, spiegando brevemente il motivo in italiano. Non scrivere altro.";

        let payload = JSON.stringify({
            contents: [{
                parts: [{ text: istruzioniSistema }]
            }]
        });

        let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + CHIAVE_API_GEMINI;

        let richiesta = new XMLHttpRequest();
        richiesta.open("POST", url, true);
        richiesta.setRequestHeader("Content-Type", "application/json");

        richiesta.onreadystatechange = function () {
            if (richiesta.readyState == 4) {
                let elementoCaricamento = corpoChat.querySelector(".messaggio-caricamento");
                if (elementoCaricamento) {
                    elementoCaricamento.remove();
                }

                if (richiesta.status == 200) {
                    let rispDati = JSON.parse(richiesta.responseText);
                    let testoIa = "Non ho ricevuto risposta da Gemini.";
                    if (rispDati.candidates && rispDati.candidates[0] && rispDati.candidates[0].content && rispDati.candidates[0].content.parts && rispDati.candidates[0].content.parts[0]) {
                        testoIa = rispDati.candidates[0].content.parts[0].text;
                    }
                    aggiungiMessaggioChat(testoIa, "ai");
                } else {
                    if (richiesta.status == 400 || richiesta.status == 403) {
                        aggiungiMessaggioChat("Chiave API non valida o mancante. Inserisci la tua chiave API di Gemini all'interno del file navbar-shared.js!", "ai");
                    } else {
                        aggiungiMessaggioChat("Errore di comunicazione con il server di Gemini. Riprova più tardi.", "ai");
                    }
                }
            }
        };

        richiesta.send(payload);
    }
});
