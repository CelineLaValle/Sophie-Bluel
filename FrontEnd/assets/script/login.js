
// Récupération des users

// async function postUsers(userData) {
//     const response = await fetch('http://localhost:5678/api/users/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },

//       body: JSON.stringify({
//         "email": "sophie.bluel@test.tld",
//         "password": "S0phie"
//       })
//     });
//     return await response.json();
//   }

//   postUsers();



// // Fonction de connexion







// async function loginUser() {
//     // Récupération des users dans la fonction
//     const users = await postUsers();
//     //On écoute l'envoi (submit)
//     form.addEventListener("submit", (e) => {
//         // Pour éviter le rechargement de la page apres le submit
//         e.preventDefault();
//         // Récupération de la valeur des inputs email et password
//         const userEmail = email.value;
//         const userPassword = password.value;

//         users.forEach(user => {
//             // Vérification de l'email et du mot de passe
//             if (userEmail === user.email && userPassword === user.password) {
//                 // Si l'email et le mot de passe sont correct, cela valide la connexion
//                 window.sessionStorage.loged = true;
//         } else {
//             // Sinon, on met les input en rouge et on affiche un message d'erreur
//             email.classList.add('input-error')
//             password.classList.add('input-error')
//             errorMessage.textContent = "Votre email ou votre mot de passe est incorrect";
//         }
//         })
//     })
// }

// loginUser();

const email = document.querySelector('#email');
const password = document.querySelector('#password');
const form = document.querySelector('#loginForm');
const errorMessage = document.querySelector('.error');


  async function postUsers() {
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      const user = await response.json();
    } catch (error) {
      showError();
    }
  }

// window.location.href = '../index.html';

  function showError() {
    email.classList.add('input-error');
    password.classList.add('input-error');
    errorMessage.textContent = "Votre email ou votre mot de passe est incorrect";
  }

  // On écoute l'envoi (submit)
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

// Quand l'utilisateur est connecté

