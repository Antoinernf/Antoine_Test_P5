let formulaireDonnees;
let panierVide;
let prixTotal;
let order;
var products = JSON.parse(localStorage.getItem("product_id")); // récupération données du localstorage
const donneesPagePanier = document.getElementById("containerCheckout"); // Affichage des produits du panier au DOM

// Vérifier si le panier est rempli et ajout des produits mis au panier
if (products === null || products == 0) {
  // Verification si le panier est vide
  console.log("panier plein");
  pageVideHTML();
} else {
  console.log("panier plein");
  let panierPleinStructure = []; // Création d'un tableau pour mettre les produits
  tableauRecapProduit(panierPleinStructure); // Afficher les produits ajoutés au panier
  viderToutLePanier(); // Vider tout le panier
  viderUnArticle(); // Retirer un article après l'autre
  prixTotalCommande(); // Calcul et affichage du prix total commande
  formulaireCommande(); // Affichage du formulaire de commande

  /** GESTION DU FORMULAIRE ET DES DONNEES UTILISATEURS **/
  // Envoyer des informations via le boutton valider du formulaire //
  const bouttonFormulaire = document.querySelector(".bouttonPersonnalise"); // Selection du boutton d'envoie du formulaire
  bouttonFormulaire.addEventListener("click", (e) => {
    // Gestionnaire d'evenement pour écouter le click sur le boutton
    const contact = recuperationValeursFormulaire(); // Récupération des valeurs du formulaires et les mettre dans un tableau stocké dans une variable.

    //---VERFICIATION AVANT ENVOIE DU FORMULAIRE---//
    // FONCTION REGEX //
    // Fonction REGEX 1 decryptage : Lettre entre A et Z majuscule et minuscule + entre 2 et 20 caracteres.
    const regex1 = (value) => {
      return /^[A-Za-z]{3,20}$/.test(value);
    };

    // Fonction REGEX 2 decryptage : Caracteres + @ + caracteres + . + 2 à 4 caracteres
    const regex3 = (value) => {
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    };

    // Fonction REGEX 3 decryptage : Lettres et chiffres autorisé entre 5 et 55 caracteres
    const regex4 = (value) => {
      return /^[A-Za-z0-9\s]{5,155}$/.test(value);
    };

    // CONTROLE VALIDITE DE CHAQUE INPUT //
    // REGEX 1 : Controle de la validite du nom
    function verifNom() {
      const verifNomData = contact.nom;
      if (regex1(verifNomData)) {
        console.log("OK pour le nom");
        return true;
      } else {
        console.log("Nom non valide");
        return false;
      }
    }

    // REGEX 1 : Controle de la validite du prenom
    function verifPrenom() {
      const verifPrenomData = contact.prenom;
      if (regex1(verifPrenomData)) {
        console.log("OK pour le prenom");
        return true;
      } else {
        console.log("Prenom non valide");
        return false;
      }
    }

    // REGEX 1 : Controle de la validite de la ville
    function verifVille() {
      const verifVilleData = contact.ville;
      if (regex1(verifVilleData)) {
        console.log("OK pour la ville");
        return true;
      } else {
        console.log("Ville non valide");
        return false;
      }
    }

    // REGEX 2 : Controle de la validite de l'email
    function verifEmail() {
      const verifEmailData = contact.email;
      if (regex3(verifEmailData)) {
        console.log("OK pour l'email");
        return true;
      } else {
        console.log("Email non valide");
        return false;
      }
    }

    // REGEX 3 : Controle de la validite de l'adresse
    function verifAdresse() {
      const verifAdresseData = contact.adresse;
      if (regex4(verifAdresseData)) {
        console.log("OK pour l'adresse");
        return true;
      } else {
        console.log("Adresse non valide");
        return false;
      }
    }

    // ---ENVOI DU FORMULAIRE SUR L'API---//
    if (
      verifNom() &&
      verifPrenom() &&
      verifVille() &&
      verifEmail() &&
      verifAdresse()
    ) {
      //----- Envoi de données dans le localStorage.---//
      // Envoi du prix total de la commande
      localStorage.setItem("prixTotal", JSON.stringify(prixTotal));
      // Gestion du contenu des produits formatage pour envoi API post.
      let tableauProduitAPI = products.map((products) => products.product_id);
      const firstName = document.querySelector("#nom").value;
      const lastName = document.querySelector("#prenom").value;
      const email = document.querySelector("#email").value;
      const address = document.querySelector("#adresse").value;
      const city = document.querySelector("#ville").value;

      donneesUtilisateurEnvoi(
        firstName,
        lastName,
        email,
        address,
        city,
        tableauProduitAPI
      );
      const requestOptions = envoiApiPost();

      fetch(`http://localhost:3001/api/teddies/order`, requestOptions)
        .then((response) => response.json())
        .then((json) => {
          document.location.href = `./confirmationCommande.html?id=${json.orderId}`;
        })

        .catch((error) => {
          alert(
            "Il y a une erreur dans l'envoie des données à l'API de retour"
          );
        });
    } // Fermeture du IF
    else {
      // Capturer l'erreur et envoyer un message d'erreur à l'utilisateur
      erreurRemplissageFormulaire();
    } // Fin du else
  }); // Attention : Fin du addeventlistener
} // Attention : Fin du ELSE page avec produit au panier

//-------------------------DECLARATION DES FONCTIONS------------------------------//
// Fonction qui génére le formulaire
function formulaireCommande() {
  formulaireDonnees = `
        <div class="formContentInput">
        <form class="formulaireCheckOut">
            <h2> Remplisser vos informations personnelles :  </h2>
            <br/>
            <input id="nom" type="text" name="nom"  placeholder="Nom"/>
            <input id="prenom" type="text" name="prenom"  placeholder="Prenom"/>
            <input id="email" type="email" name="e-mail"  placeholder="Email">
            <input id="adresse" type="text" name="adresse"  placeholder="Adresse"/>
            <input id="ville" type="text" name="ville"  placeholder="Ville"/>
            <br/>
            <span id="errorSaisie" class="errorCSS"> </span>
            <input type ="button" class="bouttonPersonnalise"  value="VALIDER"/>
        </form>
      </div>
        `;
  donneesPagePanier.insertAdjacentHTML("beforeend", formulaireDonnees); // Ajout du contenu du DOM
}

// Fonction générer le code HTML qui récap les produits au panier
function tableauRecapProduit(panierPleinStructure) {
  for (k = 0; k < products.length; k++) {
    panierPleinStructure =
      panierPleinStructure +
      `
          <div id="produitsAuPanierContenu">
            <div id="elements_nom"> ${products[k].name} <div class="colorOption"> Couleur : ${products[k].optionProduit} </div> </div>
            <div id="elements_prix"> ${products[k].price}€ </div>
            <div id="elements_quantite"> ${products[k].quantite} pièce(s) </div>
            <div id="delete"> <button class="supprimerProduit"> ✕ </button> </div>
          </div>
          `;
    donneesPagePanier.innerHTML = panierPleinStructure; // Ajout du contenu du DOM
  }
}

// Fonction qui permet de générer le contenu HTML de la page si pas de produit au panier
function pageVideHTML() {
  panierVide = `
    <div class="panierVide"> <p> Mon panier est vide</p>
    </div>
    `;
  donneesPagePanier.innerHTML = panierVide;
}

// Fonction qui permet d'afficher un message d'erreur si le formulaire est mal rempli
function erreurRemplissageFormulaire() {
  const errorMessage = document.getElementById("errorSaisie");
  const annonceError = `
  <p> 🐻  Merci de remplir correctement le formulaire de commande 🐻 <p> `;
  errorMessage.insertAdjacentHTML("beforeend", annonceError);
}

// Fonction qui permet de vider tout le panier avec un boutton afficher sur l'écran
function viderToutLePanier() {
  const btnToutSupprimer = `
    <button class="btnToutSupprimer"> Vider mon panier </button>
    `;
  donneesPagePanier.insertAdjacentHTML("beforeend", btnToutSupprimer); // Insertion du boutton dans le HTML du panier
  const btnToutSupprimerActionClic =
    document.querySelector(".btnToutSupprimer"); // Selection de la ref du boutton vider le pannier
  btnToutSupprimerActionClic.addEventListener("click", (event) => {
    // Suppresion de la cle produit (product_id) pour vider le panier entierement
    event.preventDefault();
    localStorage.removeItem("product_id"); // Utiliser la methode .removeItem pour vider le local Storage
    alert("Le panier a été vidé");
    window.location.href = "./checkout.html";
  });
}

// Fonction qui permet de retirer un article du panier un après l'autre
function viderUnArticle() {
  let supprimerProduit = document.querySelectorAll(".supprimerProduit"); // Selection le bon élément du DOM
  for (let l = 0; l < supprimerProduit.length; l++) {
    // Ecouter l 'évènement du clique de l'utilisateur
    supprimerProduit[l].addEventListener("click", (event) => {
      event.preventDefault();
      let idSelectionSuppression = products[l].product_id; // Selectionner ID du produit qui va être supprimé
      products = products.filter(
        (el) => el.product_id !== idSelectionSuppression
      ); // Utilisation méthode FILTER -> Suppression de l'élément cliqué par la conservation stricte des autres éléments. Avec ! on ne garde que les éléments en dehors du poduit supprimé
      localStorage.setItem("product_id", JSON.stringify(products)); // On envoie la variable dans le local storage.
      alert("Produit supprimé !"); //Alerte pour avertir que le produit a été supprimé du panier.
      window.location.href = "./checkout.html"; // et rechargement de la page.
    });
  }
}

// Fonction qui permet d'afficher le prix total de la commande
function prixTotalCommande() {
  // Declaration de la variable prix et stockage des données dans un tableau
  let prixTotalCalcul = [];
  for (let m = 0; m < products.length; m++) {
    // Incrémentation pour ajouter chaque produit au panier
    let prixTotalPanier = products[m].price;
    prixTotalCalcul.push(prixTotalPanier); // ajout des prix au tableau à chaque tour de boucle for
  }
  const reducer = (accumulator, currentValue) => accumulator + currentValue; // Additionner les prix présent dans le tableau
  prixTotal = prixTotalCalcul.reduce(reducer, 0);
  const affichagePrixTotal = `
  <div class="prixTotal"> Montant total : ${prixTotal} € </div>
  `;
  donneesPagePanier.insertAdjacentHTML("beforeend", affichagePrixTotal); // Implémentation dans le code HTML
}

// Fonction récupération des valeurs du formulaires et les mettre dans un tableau stocké dans une variable.
function recuperationValeursFormulaire() {
  return {
    firstName: document.querySelector("#nom").value,
    lastName: document.querySelector("#prenom").value,
    email: document.querySelector("#email").value,
    address: document.querySelector("#adresse").value,
    city: document.querySelector("#ville").value,
  };
}

// FONCTION ENVOI API //
// Fonction qui formate les données utilisateurs pour envoi à API (informations personnelles et produits commandés)
function donneesUtilisateurEnvoi(
  firstName,
  lastName,
  email,
  address,
  city,
  tableauProduitAPI
) {
  order = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      city: city,
    },
    products: tableauProduitAPI,
  };
}

// Fonction envoi API méthode post
function envoiApiPost() {
  return {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json; charset=utf-8" },
  };
}
