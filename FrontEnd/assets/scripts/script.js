let uniqueCategories;
let allWorks;
let sectionFilter = document.querySelector(".filters");


// Get all the works
const getWorks = async () => {
  const works = await fetch("http://localhost:5678/api/works");
  allWorks = await works.json();

  displayFilterButtons(allWorks);
  displayWorks(allWorks);
};

sectionFilter.addEventListener("click", function (event) {
  if (event.target.classList.contains("filterCategory")) {
    filterWorks(event.target.id);
  }
});


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

function getCategories() {
  let categories = allWorks.map((work) => work.category); // list all categories with duplicates
  uniqueCategories = new Map(
    categories.map((cat) => [cat["id"], cat])
  ).values(); // remove duplicates by id

  console.log(uniqueCategories);
  return uniqueCategories;
}

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

getWorks();

const userToken = window.localStorage.getItem("Token");
const logElement = document.getElementById("logLink");


logElement.addEventListener("click", function (event) {
  if (logElement.textContent === "login") {
    window.location.href = "./login.html";
  }
  else {
    window.localStorage.removeItem("Token");
    logElement.textContent = "login";
    window.location.href = "./index.html";
  }
});

if (userToken !== null) {
  logElement.textContent = "logout";
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

  sectionFilter.style.display = "none";

  const elemTitle = document.createElement('div');
  elemTitle.className = "projectTitle";
  
  const portSection = document.getElementById("portfolio");
  const titleP = portSection.querySelector("h2");
  const iconElement2 = document.createElement('i');
  iconElement2.className = "fa-regular fa-pen-to-square";
  const editSpan = document.createElement('span');
  const editText = document.createTextNode("modifier");

  editSpan.appendChild(iconElement2);
  editSpan.appendChild(editText);
 

  elemTitle.appendChild(titleP);
  elemTitle.appendChild(editSpan);


  portSection.insertBefore(elemTitle, portSection.firstChild);
  console.log(portSection);
}

else {
  logElement.textContent = "login";
}