/**Déclaration des variables globales */
let uniqueCategories;
let allWorks;
let sectionFilter = document.querySelector(".filters");
let editWorks;
const modal_container = document.getElementById("modal_container");
const closeModal = document.getElementById("closeModal");
const galleryContainer = document.querySelector(".galleryContainer");
let galleryModal = document.querySelector(".galleryModal");
const userToken = window.localStorage.getItem("Token");
const logElement = document.getElementById("logLink");
let closeFormModal = document.getElementById("closeFormModal");
const addImageBtn = document.getElementById("addImageBtn");
const ajoutPhotoForm = document.querySelector(".ajoutPhotoForm");
const imageContainer = document.querySelector(".imageContainer");
const categoryList = document.getElementById("categoryList");
let inputFile;
let workTitle = document.getElementById("workTitle");
let errorMessage = document.getElementById("errorMessageImg");

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
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories"); // list all categories with duplicates
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("La requête retourne une erreur", error);
  }
}

/* Cette fonction affiche les travaux en fonction de la catégorie sélectionnée */
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
async function displayFilterButtons(allWorks) {
  let categories = await getCategories();
  console.log(categories);
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
  const elemEdition = document.createElement("div");
  elemEdition.className = "editionMode";
  const elemSpan = document.createElement("span");
  const iconElement = document.createElement("i");
  iconElement.className = "fa-regular fa-pen-to-square";
  const spanText = document.createTextNode("Mode édition");
  elemSpan.appendChild(iconElement);
  elemSpan.appendChild(spanText);
  elemEdition.appendChild(elemSpan);
  document.body.insertBefore(elemEdition, document.body.firstChild);
}

/*Cette fonction affiche le bouton modifier*/
function displayEditButton() {
  const elemTitle = document.createElement("div");
  elemTitle.className = "projectTitle";
  const portSection = document.getElementById("portfolio");
  const titleP = portSection.querySelector("h2"); // on recupere le titre
  const iconElement2 = document.createElement("i");
  iconElement2.className = "fa-regular fa-pen-to-square";
  const editLink = document.createElement("a");
  editLink.className = "editWorks";
  const editText = document.createTextNode("modifier");
  editLink.appendChild(iconElement2);
  editLink.appendChild(editText);
  elemTitle.appendChild(titleP);
  elemTitle.appendChild(editLink);
  portSection.insertBefore(elemTitle, portSection.firstChild);
}

/* Cette fonction crée et affiche les travaux dans la modale */
function displayModalGallery() {
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
    trashCanIcon.className = "fa-solid fa-trash-can";

    removeWorkBtn.appendChild(trashCanIcon);

    galleryModal.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(removeWorkBtn);

    removeWorkBtn.addEventListener("click", function () {
      deleteWork(image.id);
    });
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

/* Cette fonction supprime le travail s */
function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  }).then(() => {
    allWorks = allWorks.filter((element) => {
      return parseInt(element.id) !== parseInt(workId);
    });
    displayWorks(allWorks);
    displayModalGallery();
  });
}

function displayImage(imageD) {}

function validateForm(imageD, workTitle, selectedCat) {}


function displayAjoutPhotoBtn () {
  imageContainer.innerHTML = "";
  const iconElement = document.createElement("i");
  iconElement.className = "fa-regular fa-image";
  const photoBtn = document.createElement("button");
  photoBtn.id = "ajoutPhotoBtn";
  photoBtn.textContent = "+ Ajouter photo";
  const imgType = document.createElement("span");
  imgType.textContent = "jpg, png : 4mo max";

  imageContainer.appendChild(iconElement);
  imageContainer.appendChild(photoBtn);
  imageContainer.appendChild(imgType);
}

function checkImageProperty(imageD) {
    let maxSizeBytes = 4 * 1024 * 1024;
    
    if (imageD.type !== "image/jpg" && imageD.type !== "image/png") {
     
      errorMessage.innerText="L'image n'est pas au bon format";
      errorMessage.style.display = "block";
      imageContainer.style.justifyContent = "space-evenly";
      imageContainer.style.padding = "10px 0";
      displayAjoutPhotoBtn();
      return "not ok";
    }

    if (imageD.size > maxSizeBytes) {

      errorMessage.innerText="La taille a dépassé 4Mo";
      errorMessage.style.display = "block";
      imageContainer.style.justifyContent = "space-evenly";
      imageContainer.style.padding = "10px 0";
      displayAjoutPhotoBtn()
      return "not ok";
    }

    if ((imageD.type !== "image/jpg" && imageD.type !== "image/png") && imageD.size > maxSizeBytes) {
      errorMessage.innerText="Le format et la taille ne sont pas corrects";
      errorMessage.style.display = "block";
      imageContainer.style.justifyContent = "space-evenly";
      imageContainer.style.padding = "10px 0";
      displayAjoutPhotoBtn()
      return "not ok";
    }
    return("ok");
    
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
  } else {
    window.localStorage.removeItem("Token");
    window.location.href = "./index.html";
  }
});

/* Quand l'utilisateur ferme la modale */
closeModal.addEventListener("click", function () {
  modal_container.classList.remove("show");
});

/* Quand l'utilisateur clique sur le bouton ajouter photo
   Affiche le formulaire */
addImageBtn.addEventListener("click", async function () {
  galleryContainer.style.display = "none";
  closeFormModal.style.display = "block";
  ajoutPhotoForm.style.display = "flex";
  
  displayAjoutPhotoBtn();
 
  console.log("hhhh");
  workTitle.value = "";
  for (var i = categoryList.options.length - 1; i > 0; i--) {
    categoryList.remove(i);
  }

  let categories = await getCategories();
  for (let category of categories) {
    const option = document.createElement("option");
    option.value = category.id;
    option.text = category.name;
    categoryList.add(option);
  }
  // add fetch request
});

/* Quand l'utilisateur clique sur le bouton ajouter photo
   dans le formulaire */
  imageContainer.addEventListener("click", function (event) {
    if (event.target.id === "ajoutPhotoBtn" ) {
      event.preventDefault();
      errorMessage.style.display = "none";
      inputFile = document.createElement("input");
      inputFile.type = "file";
      inputFile.onchange = (_) => {
        let files = Array.from(inputFile.files);
        console.log(files[0]);
        const selectedImg = files[0];
      
        if (checkImageProperty(selectedImg) === "ok") {  
          const reader = new FileReader();
          reader.readAsDataURL(selectedImg);
          reader.addEventListener("load", function () {
            imageContainer.innerHTML = "";
            let image = document.createElement("img");
            image.id = "imgSelected";
            image.src = reader.result;
            imageContainer.style.justifyContent = "center";
            imageContainer.style.padding = "0";
            imageContainer.appendChild(image);
            
          });}
      
      };
      inputFile.click();
    }
  })


workTitle.addEventListener("input", () => {
  let title = workTitle.value;
  console.log(title);
});

categoryList.addEventListener("change", () => {
  let value = categoryList.options[categoryList.selectedIndex].value;
  let text = categoryList.options[categoryList.selectedIndex].text;

  console.log(`${value} et ${text}`);
});

/* Quand l'utilisateur veut retourner dans la gallerie modale
   clique sur la flèche */
closeFormModal.addEventListener("click", function () {
  closeFormModal.style.display = "none";
  galleryContainer.style.display = "flex";
  ajoutPhotoForm.style.display = "none";
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
  editWorks.addEventListener("click", function () {
    modal_container.classList.add("show");
    displayModalGallery();
    closeFormModal.style.display = "none";
    galleryContainer.style.display = "flex";
    ajoutPhotoForm.style.display = "none";
  });
}
