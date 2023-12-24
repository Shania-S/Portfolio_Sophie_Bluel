import { getWorks, displayBanner,displayEditButton,displayModalGallery } from "./script.js";

/**Séquence de code */
getWorks();

if (userToken !== null) {
  logElement.textContent = "logout";

  displayBanner();

  sectionFilter.style.display = "none";

  displayEditButton();

  let editWorks = document.querySelector(".editWorks");

  /* Quand l'utilisateur clique sur le bouton modifier */
  editWorks.addEventListener("click", function (event) {
    modal_container.classList.add("show");
    displayModalGallery();
    closeFormModal.style.display = "none";
    galleryContainer.style.display = "flex";
    addNewWorkForm.style.display = "none";
  });
}
