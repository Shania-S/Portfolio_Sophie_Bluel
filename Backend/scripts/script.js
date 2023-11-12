let categories = new Set();
let uniqueCategories;
let allWorks;
let sectionFilter = document.querySelector(".filters");

// Get all the works
const getWorks = async () => {
  const works = await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((work) => {
      allWorks = work;
    });

  displayWorks(allWorks);
  createButtons(allWorks);

  let buttonCat = document.querySelectorAll(".filterCategory");
  for (category of buttonCat) {
    category.addEventListener("click", function () {
      let categoryId = this.id;
      
      if (!isNaN(parseInt(categoryId))) {
        let works = allWorks.filter((word) => word.categoryId === parseInt(categoryId)); // get works of a specific category
        displayWorks(works);
      }
      else {
        displayWorks(allWorks);
      }
    });
  }

  
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

  function createButtons(allWorks) {
    categories = allWorks.map((work) => work.category); // list all categories with duplicates
    uniqueCategories = new Map(
      categories.map((cat) => [cat["id"], cat])
    ).values(); // remove duplicates by id
    for (let item of uniqueCategories) {
      let categoryBtn = document.createElement("button");
      categoryBtn.textContent = item.name;
      categoryBtn.className = "filterCategory";
      categoryBtn.id = item.id;
      sectionFilter.appendChild(categoryBtn);
    }
  }
};


getWorks();
