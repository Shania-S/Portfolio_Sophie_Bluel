const form = document.querySelector("form");
const errorMsg = document.querySelector(".errorMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();
 
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      email: email,
      password: password,
    })
  }).then(response => { if (!response.ok) {
    errorMsg.style.display = "block";
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();

}).then((result) => {
  
  handleResult(result);

}) .catch(error => {
    console.error('Error during POST request:', error.message);
    throw error; 
  });

});


function removeError() {
  errorMsg.style.display = "none";
}

function handleResult(result) {
   window.localStorage.setItem("Token", result.token);
   window.location.href = "./index.html";
}