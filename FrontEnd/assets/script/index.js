/* fonction qui retourne le tableau */
async function getWorks () {
  const reponse = await fetch('http://localhost:5678/api/works');
  return await reponse.json();
}

async function getCategories () {
  const reponse = await fetch('http://localhost:5678/api/categories');
  return await reponse.json();
}

/* Variable */
const works = document.querySelector('.gallery');
const token = window.sessionStorage.getItem('token');

/* Fonction qui affiche les travaux */
async function displayWorks() {
  const arrayWorks = await getWorks();
  // console.log(arrayWorks);
  arrayWorks.forEach(element => {
   const figure = document.createElement('figure');
   const img = document.createElement('img');
   const figcaption = document.createElement('figcaption');
   img.src = element.imageUrl;
   figcaption.textContent = element.title;
   figure.setAttribute('category', element.categoryId);
   figure.setAttribute('worksLargeId', element.id);
   figure.appendChild(img);
   figure.appendChild(figcaption);
   works.appendChild(figure);
  })
}

displayWorks();

const filtersContainer = document.querySelector('.filters');

/* Fonction qui affiche les filtres */

async function displayButton() {
  const categories = await getCategories();
  // console.log(categories);
  categories.forEach(element => {
    const btn = document.createElement('button');
    btn.textContent = element.name;
    btn.setAttribute('category', element.id);
    btn.classList.add('filter');
    filtersContainer.appendChild(btn);
  })
  addEventOnButtons();
}

displayButton();


/* Fonction qui met un évènement sur mes boutons */

function addEventOnButtons() {
  const buttons = document.querySelectorAll('.filter');
  // console.log(buttons);
  /* On itère sur les boutons */
  buttons.forEach(btn => {
    /* On ajoute un évènement sur chaque bouton */
    btn.addEventListener('click', (e) => {
      const category = e.target.getAttribute('category');
      // console.log(category);
      filtersWorks(category);
    })
     })
    
}


/* Fonction pour trier */

/* Récupération de category par ma fonction filtersWorks(category) => filterWorks(categoryBtn) */
function filtersWorks(categoryBtn) {
  const allWorks = works.querySelectorAll('figure');
  // console.log(allWorks)
  /* Itère sur les figures */
  allWorks.forEach(figure => {
    // console.log(figure.getAttribute('category'));
    /* On compare les catégories des boutons avec les catégories des travaux */
    const categoryWork = figure.getAttribute('category');
    if (categoryBtn === categoryWork) {
      figure.style.display = 'block';
    }
    else if (categoryBtn == 0) {
      figure.style.display = 'block';
    }
    else {
      figure.style.display = 'none';
    }
      
  })
}

// Bande mode édition

const header = document.querySelector(".header");
const adminDiv = document.querySelector(".banner-admin");
const adminP = document.createElement("p");
adminDiv.classList.add("banner-admin");
adminP.classList.add("banner-p");
adminP.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
adminDiv.appendChild(adminP);
header.appendChild(adminDiv);

// Fonction modal

const dialog = document.querySelector(".modal");
const showButton = document.querySelector(".button_modal");
const closeButtons = document.querySelectorAll(".button_close");

// Le bouton "Afficher la fenêtre" ouvre le dialogue
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// Le bouton "Fermer" ferme le dialogue
closeButtons.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
})

// Afficher travaux modal

async function displayWorksModal() {
  const arrayWorks = await getWorks();
  arrayWorks.forEach(element => {
    const figure = document.createElement('figure');
    figure.classList.add("thumbnail");
    const img = document.createElement('img');
    const modalWorks = document.querySelector('.modalDisplayWorks');
    img.src = element.imageUrl;
    const deleteWork = document.createElement('div');
    deleteWork.classList.add('delete');
    deleteWork.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    figure.setAttribute('worksId', element.id);
    figure.appendChild(img);
    modalWorks.appendChild(figure);
    figure.appendChild(deleteWork);
    deleteWork.addEventListener('click', function() {
            deleteWorks(element.id, figure);
      });
    });
  };

 displayWorksModal();

 // Fonction pour supprimer une photo

 async function deleteWorks(id, figure) {
  const token = sessionStorage.getItem("token");

  console.log(id);
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },

  }).then((response) => {
    if (!response.ok) {
      // console.log("La suppression n'a pas fonctionnée");
    } else {
      // console.log("La suppression a fonctionnée");
      figure.remove();
      const figuresGallery = document.querySelector('.gallery');
      const figuresLarges = figuresGallery.querySelectorAll('figure');
      // console.log(figuresLarges);
      figuresLarges.forEach (figureLarge => {
       if (id == figureLarge.getAttribute("worksLargeId")) {
         figureLarge.remove();
       }
      })
    }
  });
}

// Fonction afficher l'une ou l'autre modal

function showModal() {
  const addPhoto = document.querySelector("#addPhoto");
  const modalGalery = document.querySelector(".modal_galery");
  const modalAddPhoto = document.querySelector(".modal_add_photo");
  const buttonBack = document.querySelector(".button_back");
  addPhoto.addEventListener('click', () => {
    modalGalery.classList.add('hidden');
    modalAddPhoto.classList.remove('hidden');
  });
  buttonBack.addEventListener('click', () => {
    modalAddPhoto.classList.add('hidden');
    modalGalery.classList.remove('hidden');
  });
  }

  showModal();

// Fonction pour vider le formulaire une fois le projet validé

  const myForm = document.getElementById('myForm');

  const resetFormFields = () => {
    const fileInput = document.getElementById('getFile');
    const descriptionInput = document.getElementById('title-image');
    const categoryInput = document.getElementById('category-image');
  
    const newFileInput = fileInput.cloneNode(true);
    fileInput.replaceWith(newFileInput);
    descriptionInput.value = '';
    categoryInput.value = '0';
  };

  // Fonction pour ajouter les travaux

  const fileInput = document.getElementById('getFile');
  const descriptionInput = document.getElementById('title-image');
  const categoryInput = document.getElementById('category-image');
  

  async function uploadFile() {
    // Créer une instance de FormData
    const formData = new FormData();
  
    // Ajouter le fichier et la description au FormData
    formData.append('image', fileInput.files[0]);
    fileInput.value = null;
    formData.append('title', descriptionInput.value);
    formData.append('category', categoryInput.value);
    // console.log('Token:', token);
    // console.log(categoryInput.value);
    // console.log(descriptionInput.value);
    // console.log(formData);
  try {
    // Envoyer la requête avec fetch
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    // Vérifier si la réponse est correcte
    if (response.ok) {
      const data = await response.json();
      console.log('Fichier téléchargé avec succès:', data);
      const figuresGallery = document.querySelector('.gallery');
      const figuresLarges = figuresGallery.querySelectorAll('figure');
      figuresLarges.forEach(figure => {
        figure.remove();
      })
      const figuresModal = document.querySelectorAll('.thumbnail');
      figuresModal.forEach(figure => {
        figure.remove();
      })
      displayWorks();
      displayWorksModal();
      // Vide le formulaire une fois le projet ajouté
      resetFormFields();
    } else {
      console.error('Erreur lors du téléchargement du fichier:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
  }
}

// Vérifie que le formulaire est bien rempli et envoie le fichier

const uploadButton = document.getElementById('uploadButton')
const errorElement = document.getElementById('error-message');

function validateAndUpload(event) {
  event.preventDefault(); // Empêcher le comportement par défaut du bouton
  console.log(fileInput.value);
  console.log(fileInput.files[0]);

  // Vérifier les champs du formulaire
  if (fileInput.files[0] == undefined || descriptionInput.value === '' || categoryInput.value === '0') {
    // Afficher un message d'erreur si l'un des champs requis n'est pas rempli
    errorElement.textContent = 'Veuillez remplir tous les champs obligatoires.';
    errorElement.style.color = 'red';
  } else {
    errorElement.textContent = '';
    // Appeler la fonction d'upload si tous les champs sont remplis
    uploadFile();
  }
}

// Ajouter un écouteur d'événement sur le clic du bouton de validation
uploadButton.addEventListener('click', validateAndUpload);

// Afficher miniature image

const getFile = document.getElementById('getFile');
const preview = document.getElementById('upload-works');
const uploadWorksElement = document.querySelector('.upload-works img');
const addPhoto = document.querySelector('.addPhoto');
const formatPhoto = document.querySelector('.formatPhoto');


getFile.addEventListener('change',() => {
  console.log(getFile.files[0])
  preview.src = URL.createObjectURL(getFile.files[0]);
    // Changer la classe de l'élément
    uploadWorksElement.className = 'thumbnail-img';
    addPhoto.style.display = 'none';
    formatPhoto.style.display = 'none';

  // const reader = new FileReader();
  //   reader.addEventListener('load',(e) => {
  //     preview.setAttribute('src', e.target.result);
  //     console.log(reader);
  //     console.log(e.target.result);
  //     console.log(preview);
  //   });
  //   reader.readAsDataURL(getFile.files[0]);
})

// // 1. Sélectionnez l'élément HTML correspondant au label de l'image
// const imageLabel = document.querySelector('.addPhoto');

// // 2. Écoutez l'événement de changement de l'input de l'élément de sélection d'image
// const imageInput = document.querySelector('.image-input');

// imageInput.addEventListener('change', function() {
//   // 3. Obtenez le nom du fichier de l'image sélectionnée
//   const fileName = imageInput.files[0].name;

//   // 4. Créez une balise <img> avec le nom du fichier en tant que source
//   const image = document.createElement('img');
//   image.src = fileName;
//   image.alt = 'uploaded-image';
//   image.classList.add('uploaded-image');

//   // 5. Remplacez le contenu de l'élément label par l'image
//   imageLabel.innerHTML = '';
//   imageLabel.appendChild(image);
// });

  // Afficher ou masquer le contenu en fonction de l'état de connexion

const tokenContent = sessionStorage.getItem('token');
const privateContent = document.querySelectorAll('.privateContent');

if (tokenContent) {
  privateContent.forEach (element => {
    element.style.display = 'flex';
    console.log(element, privateContent);
  });
} else {
  privateContent.forEach(element => {
    element.style.display = 'none';
  });
}

// Quand l'utilisateur est connecté

// Récupération du token stocké dans sessionStorage dans la variable token
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