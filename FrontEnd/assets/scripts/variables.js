/**Déclaration des variables globales */
let allWorks;
let sectionFilter = document.querySelector(".filters");
const modal_container = document.getElementById("modal_container");
const galleryContainer = document.querySelector(".galleryContainer");
const userToken = window.localStorage.getItem("Token");
const logElement = document.getElementById("logLink");
const closeFormModal = document.getElementById("closeFormModal");
const addNewWorkForm = document.querySelector(".addNewWorkForm");
const imageContainer = document.querySelector(".imageContainer");
const categoryList = document.getElementById("categoryList");
let workTitle = document.getElementById("workTitle");
const errorMessageImg = document.getElementById("errorMessageImg");
const errorMessageTitle = document.getElementById("errorMessageTitle");
const errorMessageCat = document.getElementById("errorMessageCat");

/** Form variables */
let selectedImg;
let titleW;
let categoryValue;
let categoryText;
let validerPhotoForm = document.getElementById("validerPhotoForm");
