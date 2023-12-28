/**DECLARATION DES FONCTIONS */
/* Cette fonction récupère la liste des travaux via la requête fetch */
export const getWorks = async () => {
  const works = await fetch("http://localhost:5678/api/works");
  allWorks = await works.json();
  displayFilterButtons();
  displayWorks(allWorks);
};

/* Cette fonction récupère la liste des catégories dans la liste des travaux */
async function getCategories(event) {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("La requête retourne une erreur", error);
  }
}

/* Cette fonction crée les boutons de catégories et les affiche */
async function displayFilterButtons() {
  document.getElementById("tousBtn").removeAttribute('hidden');
  let categories = await getCategories();
  console.log(categories);
  for (const item of categories) {
    let categoryBtn = document.createElement("button");
    categoryBtn.textContent = item.name;
    categoryBtn.className = "filterCategory";
    categoryBtn.id = item.id;
    sectionFilter.appendChild(categoryBtn);
  }
}

/* Cette fonction filtre les travaux en fonction de la catégorie cliquée
   et les affiche en appelant la fonction displayWorks()*/
function filterWorks(catId) {

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

/* Cette fonction affiche les travaux en fonction de la catégorie sélectionnée */
function displayWorks(filteredWork) {
  document.querySelector(".gallery").innerHTML = "";
  let gallery = document.querySelector(".gallery");
  for (const index in filteredWork) {
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

/*Cette fonction affiche le bandeau en haut */
export function displayBanner() {
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
export function displayEditButton() {
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
export function displayModalGallery() {
  let galleryModal = document.querySelector(".galleryModal");
  galleryModal.innerHTML = "";
  for (const work in allWorks) {
    let figure = document.createElement("figure");
    let image = document.createElement("img");
    image.className = "imageModal";
    image.setAttribute("id", allWorks[work].id);
    image.src = allWorks[work].imageUrl;
    image.alt = allWorks[work].title;
    let removeWorkBtn = document.createElement("button");
    removeWorkBtn.className = "removeWork";
    removeWorkBtn.type = "button";
    let trashCanIcon = document.createElement("i");
    trashCanIcon.className = "fa-solid fa-trash-can";

    removeWorkBtn.appendChild(trashCanIcon);

    galleryModal.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(removeWorkBtn);

      removeWorkBtn.addEventListener("click", function () {
   
        console.log(image.id);
        deleteWork(image.id);

      });

  }
}

/* Cette fonction supprime le travail*/
function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  }).then(() => {
    allWorks = allWorks.filter((element) => 
   parseInt(element.id) !== parseInt(workId)
    );
    displayModalGallery();
    displayWorks(allWorks);
  });
}

/* Cette fonction crée/affiche le bouton pour 
 preview une image */
function displayAjoutPhotoBtn() {
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
  imageContainer.style.justifyContent = "space-evenly";
  imageContainer.style.padding = "10px 0";
}

/* Cette fonction vérifie le type et la taille de l'image */
function checkImageProperty(imageD) {
  let maxSizeBytes = 4 * 1024 * 1024;

  if (imageD.size > maxSizeBytes) {
    errorMessageImg.innerText = "La taille a dépassé 4Mo";
    errorMessageImg.style.display = "block";
    imageContainer.style.justifyContent = "space-evenly";
    imageContainer.style.padding = "10px 0";
    selectedImg = "";
    displayAjoutPhotoBtn();
    return "not ok";
  }

  return "ok";
}

/* Cette fonction change la couleur du bouton du formulaire */
function updateFormValidity() {
  if (titleW && categoryValue && selectedImg) {
    validerPhotoBtnForm.disabled = false;
  } else {
    validerPhotoBtnForm.disabled = true;
  }
}

/* Envoi du nouveau work */
function sendForm(image, titleW, categoryValue) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", titleW);
  formData.append("category", categoryValue);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      allWorks.push(data);
      modal_container.classList.remove("show");
      displayWorks(allWorks);
    })
    .catch((error) => {
      console.error("Une erreur est survenue:", error);
    });
}

/**DECLARATION DES EVENT LISTENERS */
/* Quand l'utilisateur clique sur login/logout */
logElement.addEventListener("click", function (event) {
  if (logElement.textContent === "login") {
    window.location.href = "./login.html";
  } else {
    window.localStorage.removeItem("Token");
    window.location.href = "./index.html";
  }
});

/* Quand l'utilisateur filtre les travaux */
sectionFilter.addEventListener("click", function (event) {
  if (event.target.classList.contains("filterCategory")) {
    filterWorks(event.target.id);
  }
});

/* Quand l'utilisateur ferme la modale */
document.getElementById("closeModal").addEventListener("click", function () {
  modal_container.classList.remove("show");
});
document.getElementById("modal_container").addEventListener("click", function (event) {
    if (!event.target.closest(".modal")) {
      modal_container.classList.remove("show");
    }
  });

/* Quand l'utilisateur clique sur le bouton ajouter photo
   Affiche le formulaire */
document.getElementById("addImageBtn").addEventListener("click", async function () {
    galleryContainer.style.display = "none";
    closeFormModal.style.display = "block";
    addNewWorkForm.style.display = "flex";

    displayAjoutPhotoBtn();
    errorMessageImg.style.display = "none";
    errorMessageCat.style.display = "none";
    errorMessageTitle.style.display = "none";
    workTitle.value = "";
    selectedImg = "";
    categoryValue = "";
    for (var i = categoryList.options.length - 1; i > 0; i--) {
      categoryList.remove(i);
    }
    let categories = await getCategories();
    for (const category of categories) {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categoryList.add(option);
    }
    validerPhotoBtnForm.disabled = true;
  });

/* Quand l'utilisateur clique sur le bouton ajouter photo
   dans le formulaire */
imageContainer.addEventListener("click", function (event) {
  if (event.target.id === "ajoutPhotoBtn") {
    event.preventDefault();
    errorMessageImg.style.display = "none";
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/png, image/jpg";
    inputFile.click();

    inputFile.onchange = () => {

      const files = Array.from(inputFile.files);
      console.log(files[0]);
      selectedImg = files[0];
      if (checkImageProperty(selectedImg) === "ok") {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.addEventListener("load", function () {
          imageContainer.innerHTML = "";
          const image = document.createElement("img");
          image.id = "imgSelected";
          image.src = reader.result;
          imageContainer.style.justifyContent = "center";
          imageContainer.style.padding = "0";
          imageContainer.appendChild(image);
          updateFormValidity();
        });
      }
    };

    // Quand l'utilisateur clique sur annuler/cancel
    inputFile.addEventListener("cancel", (event) => {
      errorMessageImg.innerText = "Veuillez sélectionner une image";
      errorMessageImg.style.display = "block";
    });
  }
});


/* Récupère ce que saisit l'utilisateur */
workTitle.addEventListener("input", () => {
  errorMessageTitle.style.display = "none";
  titleW = workTitle.value;
  updateFormValidity();
});


/* Quand l'utilisateur clique en dehors de l'input titre*/
workTitle.addEventListener("focusout", () => {
  if (!titleW) {
    errorMessageTitle.style.display = "block";
    errorMessageTitle.innerText = "Le titre est requis";
  }
});

/* Récupère l'option sélectionée */
categoryList.addEventListener("change", () => {
  errorMessageCat.style.display = "none";
  categoryValue = categoryList.options[categoryList.selectedIndex].value;
  categoryText = categoryList.options[categoryList.selectedIndex].text;
  updateFormValidity();
});

/* Quand l'utilisateur clique en dehors de l'input catégorie*/

categoryList.addEventListener("focusout", () => {
  if (!categoryValue) {
    errorMessageCat.style.display = "block";
    errorMessageCat.innerText = "La catégorie est requise";
  }
});


/* Quand l'utilisateur clique sur le bouton valider
   envoi du formulaire*/
addNewWorkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendForm(selectedImg, titleW, categoryValue);
});

/* Quand l'utilisateur veut retourner dans la gallerie modale
   clique sur la flèche */
closeFormModal.addEventListener("click", function () {
  closeFormModal.style.display = "none";
  galleryContainer.style.display = "flex";
  addNewWorkForm.style.display = "none";
});
