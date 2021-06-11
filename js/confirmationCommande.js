//--- Déclaration des variables ---//
let url = recuperationURL();
let numeroCommande = recuperationIDProduit();
let prixTotal = prixLocalStorage();

affichageConfirmationCommande();
deleteLocalStorage("prixTotal"); // Supression du prix total dans le localStorage
deleteLocalStorage("product_id"); // Suppression du panier dans le localstorage

//-------------------------DECLARATION DES FONCTIONS------------------------------//
// Récupérer l'URL de la page
function recuperationURL() {
  return new URL(window.location.href);
}

// Récupérer les ID des URL
function recuperationIDProduit() {
  return url.searchParams.get("id");
}

// Récupérer le prix total de la commande dans le local Storage
function prixLocalStorage() {
  return localStorage.getItem("prixTotal");
}

// Fonction retirer les localStorage
function deleteLocalStorage(key) {
  localStorage.removeItem(key);
}

// Génération du contenu de la page de remerciement
function affichageConfirmationCommande() {
  const positionElement5 = document.getElementById(
    "containerConfirmationCommande"
  ); //Ajout du contenu de la page
  const structureConfirmationCommande = `
        <div> <h1> Merci pour votre commande ! </h1> </div>
        <br/>
        <div> <img width="80px" src="./img/heart.gif"> </div>
        <br/>
        <p> Votre commande numéro <span> ${numeroCommande} </span> a bien été pris en compte </p>
        <p> Montant total : <span> ${prixTotal} </span> € </p>
        <br/>
        <div> <img width="80px" src="./img/livraison.png"> </div>
        <p> Livraison estimé dans 3 jours ouvrés ! </p>
    `;
  positionElement5.insertAdjacentHTML(
    "afterbegin",
    structureConfirmationCommande
  ); // Injection de l'HMTL
}
