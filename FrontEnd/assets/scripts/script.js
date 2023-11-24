/**Déclaration des variables globales */
let uniqueCategories;
let allWorks;
let sectionFilter = document.querySelector(".filters");
let editWorks;
const modal_container = document.getElementById("modal_container");
const closeModal = document.getElementById("closeModal");
let galleryModal = document.querySelector(".galleryModal");
const userToken = window.localStorage.getItem("Token");
const logElement = document.getElementById("logLink");


/**Déclaration des fonctions */
/* Cette fonction récupère la liste des travaux via la requête fetch */
const getWorks = async () => {
  const works = await fetch("http://localhost:5678/api/works");
  allWorks = await works.json();
  displayFilterButtons(allWorks);
  displayWorks(allWorks);
};

/* Cette fonction récupère la liste des catégories dans la liste des travaux
   On aurait aussi pu faire une requête*/
   function getCategories() {
    let categories = allWorks.map((work) => work.category); // list all categories with duplicates
    uniqueCategories = new Map(
      categories.map((cat) => [cat["id"], cat])
    ).values(); // remove duplicates by id
  
    return uniqueCategories;
  }

/* Cette fonction affiche les travaux en fonction des categories */
function displayWorks(filteredWork) {
  document.querySelector(".gallery").innerHTML = "";
  let gallery = document.querySelector(".gallery");
  for (index in filteredWork) {
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    image.src = filteredWork[index].imageUrl;
    image.alt = filteredWork[index].title;
    figcaption.innerText = filteredWork[index].title;
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(figcaption);
  }
}

/* Cette fonction crée les boutons de catégories et les affiche */
function displayFilterButtons(allWorks) {
  let categories = getCategories();
  for (let item of categories) {
    let categoryBtn = document.createElement("button");
    categoryBtn.textContent = item.name;
    categoryBtn.className = "filterCategory";
    categoryBtn.id = item.id;
    sectionFilter.appendChild(categoryBtn);
  }
}

/*Cette fonction affiche le bandeau en haut */
function displayBanner() {
  const elemEdition = document.createElement('div');
  elemEdition.className = "editionMode"
  const elemSpan = document.createElement('span');
  const iconElement = document.createElement('i');
  iconElement.className = "fa-regular fa-pen-to-square";
  const spanText = document.createTextNode("Mode édition");
  elemSpan.appendChild(iconElement);
  elemSpan.appendChild(spanText);
  elemEdition.appendChild(elemSpan);
  document.body.insertBefore(elemEdition, document.body.firstChild);
}

/*Cette fonction affiche le bouton modifier*/
function displayEditButton() {
  const elemTitle = document.createElement('div');
  elemTitle.className = "projectTitle";
  const portSection = document.getElementById("portfolio");
  const titleP = portSection.querySelector("h2"); // on recupere le titre 
  const iconElement2 = document.createElement('i');
  iconElement2.className = "fa-regular fa-pen-to-square";
  const editLink = document.createElement('a');
  editLink.className = "editWorks";
  const editText = document.createTextNode("modifier");
  editLink.appendChild(iconElement2);
  editLink.appendChild(editText);
  elemTitle.appendChild(titleP);
  elemTitle.appendChild(editLink);
  portSection.insertBefore(elemTitle, portSection.firstChild);
}

/* Cette fonction crée et affiche les travaux dans la modale */
function displayModalGallery () {
  galleryModal.innerHTML = "";
  for (work in allWorks) {
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    image.className = "imageModal";
    image.setAttribute("id", allWorks[work].id);
    image.src = allWorks[work].imageUrl;
    image.alt = allWorks[work].title;
    let removeWorkBtn = document.createElement("button");
    removeWorkBtn.className = "removeWork";
    let trashCanIcon = document.createElement("i");
    trashCanIcon.className ="fa-solid fa-trash-can";
    
    removeWorkBtn.appendChild(trashCanIcon);
    // créer bouton
    galleryModal.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(removeWorkBtn);
  }
}

/* Cette fonction filtre les travaux en fonction de la catégorie cliquée
   et les affiche en appelant la fonction displayWorks()*/
   function filterWorks(catId) {
    console.log(catId);
    let categoryId = catId;
    if (!isNaN(parseInt(categoryId))) {
      let works = allWorks.filter(
        (work) => work.categoryId === parseInt(categoryId)
      ); // get works of a specific category
      displayWorks(works);
    } else {
      displayWorks(allWorks);
    }
  }

/**Déclaration des event listeners */
/* Quand l'utilisateur filtre les travaux */
sectionFilter.addEventListener("click", function (event) {
  if (event.target.classList.contains("filterCategory")) {
    filterWorks(event.target.id);
  }
});

/* Quand l'utilisateur clique sur login/logout */
logElement.addEventListener("click", function (event) {
  if (logElement.textContent === "login") {
    window.location.href = "./login.html";
  }
  else {
    window.localStorage.removeItem("Token");
    window.location.href = "./index.html";
  }
});

/* Quand l'utilisateur ferme la modale */
closeModal.addEventListener("click", function ()  {
  modal_container.classList.remove("show");
});


/**Séquence de code */
getWorks();

if (userToken !== null) {
  logElement.textContent = "logout";

  displayBanner();

  sectionFilter.style.display = "none";

  displayEditButton();

  editWorks = document.querySelector(".editWorks");

  /* Quand l'utilisateur clique sur le bouton modifier */
  editWorks.addEventListener("click", function ()  {
  modal_container.classList.add("show");
  displayModalGallery();

});
}
