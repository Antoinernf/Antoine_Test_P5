let recuperationUrlProduit = recuperationUrlProduitFonction();
let IDProduit = recuperationIDProduit();
let structureQuantite;
let positionElementQuantite;
let ajoutProduitLocalStorage;
let optionProduitPanier;
const recuperationPageProduits = fetch(
  `http://localhost:3001/api/teddies/${IDProduit}`
); // Variable stock URL API

recuperationPageProduits // Creation promesse
  .then((reponsePageProduit) => {
    const donneesPageProduits = reponsePageProduit.json(); // Convertir format JSON
    donneesPageProduits // On récupere avec le then les datas et on les implémente dans le DOM : .then pour rentrer dans la promesse
      .then((reponse2PP) => {
        presentationProduit(reponse2PP);

        //----------ADAPTION DES OPTIONS PRODUITS------------//
        const optionQuantite = reponse2PP.colors; //Selectionner le tableau avec les valeurs
        let structureOptionProduit = document.getElementById("optionProduit"); //Creation d'une boucle for pour afficher toutes les options disponibles
        gestionQuantiteProduitInput(optionQuantite, structureOptionProduit);

        //-------CHOIX DE LA QUANTITE ------------------//
        gestionQuantiteProduitImplementationHTML(structureQuantite);

        //-----------GESTION DU PANIER -------------//
        // Récupération des données sélectionnées par l'utilisateur et l'envoie du panier
        const idForm = document.getElementById("optionProduit"); // Selection de l'ID du formulaire
        const btnPanier = document.getElementById("buttonAddCard"); // Selection du boutton ajouter au panier

        // Ecouter le boutton et envoyer le panier. Function de callback avec event
        btnPanier.addEventListener("click", (event) => {
          event.preventDefault(); // ne pas actualiser la page

          const choixForm = idForm.value; // Mettre le choix de l'utilisateur dans une variable
          const choixQuantite = positionElementQuantite.value; // Mettre la quantité choisi dans une variable
          recuperationValeursOptions(reponse2PP, choixForm, choixQuantite); // Récupération des valeurs du formulaire

          //--------------------- GESTION LOCAL STORAGE ----------------------//
          // Stocker la récupération des valeurs du formulaire dans le local storage//
          let produitStorage = JSON.parse(localStorage.getItem("product_id")); // Lire la clé produit dans le local storage.

          // Fonction ajouter un produit sélectionner dans le local storage
          appAjoutProduitLocalStorage(produitStorage, optionProduitPanier);
        });
      });
  })

  .catch((error) => {
    // On attrape les erreurs.
    alert("Il y a une erreur dans la lecture de l'API");
  });

//-------------------------DECLARATION DES FONCTIONS------------------------------//
// Confirmation d'ajout au panier d'un produit
function togglePopup() {
  document.getElementById("popup-1").classList.toggle("active");
}

// Récupérer l'URL du produit généré
function recuperationUrlProduitFonction() {
  return window.location.search;
}

// Récupérer l'ID de l'url
function recuperationIDProduit() {
  return recuperationUrlProduit.slice(1);
}

//--- FONCTION LIEES AUX LOCAL STORAGE ET GESTION DES DONNEES---//
// Ajout du produit ajouté au panier dans le localStorage.
function appAjoutProduitLocalStorage(produitStorage, optionProduitPanier) {
  const ajoutProduitLocalStorage = () => {
    // Ajout dans le tableau de l'objet avec les valeurs choisi par l'utilisateur.
    produitStorage.push(optionProduitPanier);
    localStorage.setItem("product_id", JSON.stringify(produitStorage)); // Transformation JSON et envoi dans la key "product_id" du local storage
  };

  // Condition gestion présence de données dans localstorage
  if (produitStorage) {
    // Si produit déjà enregistré dans local storage
    ajoutProduitLocalStorage();
  } else {
    // Si produit pas enregistré dans le local storage
    produitStorage = [];
    ajoutProduitLocalStorage();
  }
}

//--- FONCTION LIEE A LA GESTION DES DONNEES---//
// Function de récupération des valeurs du formulaire et mis sous un tableau.
function recuperationValeursOptions(reponse2PP, choixForm, choixQuantite) {
  optionProduitPanier = {
    name: reponse2PP.name,
    product_id: reponse2PP._id,
    optionProduit: choixForm,
    quantite: choixQuantite,
    price: (reponse2PP.price * choixQuantite) / 100,
  };
}

//--- FONCTION D'IMPLEMENTATION DU CONTENU HTML DE LA PAGE---//
// Création de la variable "option" pour récupérer les données de optionQuantite
function gestionQuantiteProduitInput(optionQuantite, structureOptionProduit) {
  for (option of optionQuantite) {
    let affichageOption = `
            <option value="${option}">${option}</option>
    `;
    structureOptionProduit.insertAdjacentHTML("beforeend", affichageOption);
  }
}

// Choix du nombre de quantité et ajout directement a l'input
function gestionQuantiteProduitImplementationHTML(structureQuantite) {
  structureQuantite = `
                    <option value="1"> 1 </option>
                    <option value="3"> 3 </option>
                    <option value="5"> 5 </option>
                    <option value="10"> 10 </option>
                `;
  positionElementQuantite = document.querySelector("#quantite"); // Afficher dans le HTML
  positionElementQuantite.innerHTML = structureQuantite;
}

// Fonction qui affiche le contenu des produits et de ses options
function presentationProduit(reponse2PP) {
  document.getElementById("containerPageProduit").innerHTML = `
    <div id="itemPageProduit">
        <div> <img src="${reponse2PP.imageUrl}">  </div>
        <div class="content">
        <div id="elements_nom"> ${reponse2PP.name} </div>
        <div id="elements_prix"> ${reponse2PP.price / 100} € </div>
        <div id="elements_description"> ${reponse2PP.description} </div>

        <div class="formOptionProduit">
            <label for="optionProduit"> Choisir la couleur : </label>
            <select id="optionProduit" name="optionProduit">
            </select>
        </div>

        <div class="quantite">
            <label for="quantite"> Choisir la quantité : </label>
            <select id="quantite">
            </select>
        </div>

        <button  type ="submit" id="buttonAddCard" class="bouttonPersonnalise" onclick="togglePopup()"> AJOUTER AU PANIER </button>
        </div>
    </div>
    `;
}
