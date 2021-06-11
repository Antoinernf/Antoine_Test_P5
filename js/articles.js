const recuperationProduits = recuperationProduitsFonction(); // Variable stock URL API

//--- DECLARATION DES FONCTIONS ---//

// Fonction qui permet de récupérer les données de l'API
function recuperationProduitsFonction() {
  fetch("http://localhost:3001/api/teddies").then((reponse) => {
    const donneesProduits = reponse.json(); // Convertir format JSON
    donneesProduits
      .then((reponse2) => {
        // promesse résoulue
        affichageContenuProduit(reponse2);
      })
      .catch((error) => {
        // Promesse non résolue
        alert("Il y a une erreur dans la lecture de l'API");
      });
  });
}

// Fonction qui permet d'implémenter le contenu HTML à la page d'accueil
function affichageContenuProduit(reponse2) {
  document.getElementById("containerProduit").innerHTML = `
  ${reponse2
    .map(function (nounours) {
      return `
      <div id="item">
          <a href="/front-end/pageProduit.html?${nounours._id}">
            <div> <img src="${nounours.imageUrl}">  </div>
            <div id="elements_nom"> ${nounours.name} </div>
            <div id="elements_prix"> ${nounours.price / 100} € </div>
            <div id="elements_description"> ${nounours.description} </div>
            <div id="buttonBuy"> <button class="bouttonPersonnalise"> ADOPTER </button> </div>
          </a>
      </div>
    `;
    })
    .join("")}
  `;
}
