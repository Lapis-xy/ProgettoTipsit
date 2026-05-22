document.addEventListener("DOMContentLoaded", () => {
  let linkAttuale = window.location.pathname.split("/").pop();
  let linkHome = document.getElementById("link-home");
  let linkGiochi = document.getElementById("link-giochi");
  let linkTrofei = document.getElementById("link-trofei");
  let pulsanteAccount = document.getElementById("pulsante-account");
  let boxAccount = document.getElementById("box-account");

  let links = [linkHome, linkGiochi, linkTrofei].filter(Boolean);

  links.forEach(link => {
    if (link.href.split("/").pop() === linkAttuale) {
      link.classList.add("attivo");
    }
  });

  if (pulsanteAccount && boxAccount) {
    pulsanteAccount.addEventListener("click", () => {
      boxAccount.style.display = boxAccount.style.display === "block" ? "none" : "block";
    });
  }
});
