const email = document.querySelector('#email');
const password = document.querySelector('#password');
const form = document.querySelector('#loginForm');
const errorMessage = document.querySelector('.error');

  async function postUsers(email, password) {
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        // Envoi de la requête à l'API
        method: 'POST',
        // Spécifie que le contenu de la requête est au format JSON
        headers: {
          'Content-Type': 'application/json'
        },
         // Corps de la requête avec email et mot de passe au format JSON
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      // Attente de la réponse de l'API
      const user = await response.json();
      // Si l'utilisateur a un token, il est connecté
      if (user.token) {
        // Stocke le token dans la session
        window.sessionStorage.setItem('token', user.token);
        // Redirection vers la page index.html
        window.location.href = '../index.html';
        //Sinon, affiche un message d'erreur
      } else {
      showError();
    }
    // En cas d'échec de réponse de l'API
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
    
  }
  


  function showError() {
    email.classList.add('input-error');
    password.classList.add('input-error');
    errorMessage.textContent = "Votre email ou votre mot de passe est incorrect";

  }

  // On écoute l'envoi (submit)
  if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;
    
  // Réinitialise les styles d'erreur (.input-error) avant la nouvelle tentative de connexion
  email.classList.remove('input-error');
  password.classList.remove('input-error');
  errorMessage.textContent = '';
  postUsers(userEmail, userPassword);
});
}

// Quand l'utilisateur est connecté

// Récupération du token stocké dans sessionStorage dans la variable token
const token = window.sessionStorage.getItem('token');
const verifyTokenIsPresent = () =>  {
    const login_button = document.getElementById("id_login_button");
    // Si le token existe, alors l'utilisateur est connecté
    if(token) {
    // Remplace le texte du bouton par logout
    login_button.textContent = "logout";
    // Ajoute un gestionnaire d'événement pour le clic sur le bouton logout
    login_button.addEventListener("click", () => {
      // Supprime le token de sessionStorage
      window.sessionStorage.removeItem("token");
      // Change le texte du bouton par login
      login_button.textContent = "login";
      window.location.href = '../login.html';
    });
  }}

  verifyTokenIsPresent();