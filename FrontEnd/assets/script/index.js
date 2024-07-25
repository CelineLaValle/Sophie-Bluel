// Fonction qui retourne le tableau
async function getWorks () {
  const reponse = await fetch('http://localhost:5678/api/works');
  return await reponse.json();
}

// Fonction qui retourne les catégories
async function getCategories () {
  const reponse = await fetch('http://localhost:5678/api/categories');
  return await reponse.json();
}


const works = document.querySelector('.gallery');
const token = window.sessionStorage.getItem('token');

// Fonction qui affiche les travaux

async function displayWorks() {
  const arrayWorks = await getWorks();

  arrayWorks.forEach(element => {
   // Crée un élément HTML
   const figure = document.createElement('figure');
   const img = document.createElement('img');
   const figcaption = document.createElement('figcaption');
   // J'insère l'image url qui vient du tableau dans la source de l'image
   img.src = element.imageUrl;
   figcaption.textContent = element.title;
   // Ajoute un attribut "category" à l'élément <figure> avec la valeur de l'ID de la catégorie du projet
   // Cela permet de trier ou de filtrer les projets par catégorie
   figure.setAttribute('category', element.categoryId);
   figure.setAttribute('worksLargeId', element.id);
   // Ajoute l'élément <img> en tant qu'enfant de l'élément <figure>
   figure.appendChild(img);
   figure.appendChild(figcaption);
   // Ajoute l'élément <figure> complet en tant qu'enfant de l'élément parent désigné par la variable works
   works.appendChild(figure);
  })
}

displayWorks();






// FILTRES

const filtersContainer = document.querySelector('.filters');

// Fonction qui affiche les filtres

async function displayButton() {
  const categories = await getCategories();
  const btn = document.createElement('button');
  btn.textContent = 'Tous';
  btn.setAttribute('category', '0');
  btn.classList.add('filter');
  btn.classList.add('clicked');
  filtersContainer.appendChild(btn);
  categories.forEach(element => {
    const btn = document.createElement('button');
    btn.textContent = element.name;
    btn.setAttribute('category', element.id);
    btn.classList.add('filter');
    filtersContainer.appendChild(btn);
  })
  addEventOnButtons();
  addFilterEvents();
}

// Fonction qui met un évènement sur mes boutons

function addEventOnButtons() {
  const buttons = document.querySelectorAll('.filter');

  /* On itère sur les boutons */
  buttons.forEach(btn => {
    /* On ajoute un évènement sur chaque bouton */
    btn.addEventListener('click', (e) => {
      const category = e.target.getAttribute('category');
      filtersWorks(category);
    })
     })
    
}


// Fonction pour trier

// Récupération de (category) par ma fonction ci-dessus filtersWorks(category) => filtersWorks(categoryBtn)
function filtersWorks(categoryBtn) {
  const allWorks = works.querySelectorAll('figure');
  /* Itère sur les figures */
  allWorks.forEach(figure => {
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

// Couleur des filtres lorsqu'ils sont sélectionnés
function addFilterEvents() {
  const filters = document.querySelectorAll('.filter');

  filters.forEach(function(filter) {
    filter.addEventListener('click', function() {
      filters.forEach(function(f) {
        f.classList.remove('clicked');
      });

      this.classList.add('clicked');
    });
  });
}






// MODALE

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

  await fetch(`http://localhost:5678/api/works/${id}`, {

    method: "DELETE",

    headers: {

      Authorization: `Bearer ${token}`,
    },


  }).then((response) => {
    if (!response.ok) {
    } else {
      figure.remove();
      const figuresGallery = document.querySelector('.gallery');
      const figuresLarges = figuresGallery.querySelectorAll('figure');
      figuresLarges.forEach (figureLarge => {
       if (id == figureLarge.getAttribute("worksLargeId")) {
         figureLarge.remove();
       }
      })
    }
  });
}

// Fonction pour ajouter les travaux

const fileInput = document.getElementById('getFile');
const descriptionInput = document.getElementById('title-image');
const categoryInput = document.getElementById('category-image');


async function uploadFile() {
  // Créer une instance de FormData
  const formData = new FormData();

// Ajouter le fichier et la description au FormData (envoi à l'API)

  formData.append('image', fileInput.files[0]);
  // Réinitialise l'élément input de fichier après avoir ajouté le fichier à FormData
  // Permet à l'utilisateur de sélectionner à nouveau un fichier, y compris le même fichier
  fileInput.value = null;
  formData.append('title', descriptionInput.value);
  formData.append('category', categoryInput.value);
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

    const figuresGallery = document.querySelector('.gallery');
    const figuresLarges = figuresGallery.querySelectorAll('figure');
    // Permet de supprimer toute les figures pour les remettres avec celle qu'on a rajouté
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
    verifierChamps();
    const modalGalery = document.querySelector(".modal_galery");
    const modalAddPhoto = document.querySelector(".modal_add_photo");
    // Une fois valider on revient sur la première modale
    modalGalery.classList.remove('hidden');
    modalAddPhoto.classList.add('hidden');
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
  // Change la source de l'élément preview pour afficher l'image sélectionnée
  // URL.createObjectURL crée une URL temporaire pour l'image sélectionnée
preview.src = URL.createObjectURL(getFile.files[0]);

  // Changer la classe de l'élément
  uploadWorksElement.className = 'thumbnail-img';
  addPhoto.style.display = 'none';
  formatPhoto.style.display = 'none';
})

// Changer la couleur du bouton en fonction de si le formulaire est bien rempli
  
// Sélectionnez votre bouton de validation
const boutonValider = document.getElementById("uploadButton");

// Définissez une fonction pour vérifier l'état des champs et mettre à jour la couleur du bouton
function verifierChamps() {
    var champ1 = document.querySelector("#getFile").value;
    var champ2 = document.querySelector("#title-image").value;
    var champ3 = document.querySelector("#category-image").value;
    // Vérifiez toutes les conditions nécessaires pour considérer les champs comme valides
    
    if (champ1 !== "" && champ2 !== "" && champ3 !== "0") {
        boutonValider.classList.add("input_modal");
        boutonValider.classList.remove("input_modalGrey");
    } else {
        boutonValider.classList.remove("input_modal");
        boutonValider.classList.add("input_modalGrey");
    }
}

// Ajoutez des écouteurs d'événements à chaque champ pour appeler la fonction de vérification lorsqu'ils sont modifiés
document.querySelector("#getFile").addEventListener("input", verifierChamps);
document.querySelector("#title-image").addEventListener("input", verifierChamps);
document.querySelector("#category-image").addEventListener("input", verifierChamps);


// Fonction pour vider le formulaire une fois le projet validé

  const myForm = document.getElementById('myForm');

  const resetFormFields = () => {
    const fileInput = document.getElementById('getFile');
    const descriptionInput = document.getElementById('title-image');
    const categoryInput = document.getElementById('category-image');

    // Réinitialise l'image prévisualisée avec l'image par défaut
    const uploadWorksContainer = document.querySelector('.upload-works');
    const uploadWorksImage = uploadWorksContainer.querySelector('img');
    const addPhotoElement = document.querySelector('.addPhoto');
    const formatPhotoElement = document.querySelector('.formatPhoto');
    uploadWorksImage.src = './assets/icons/img.png';

    // Réinitialisation des valeurs des autres champs
    descriptionInput.value = '';
    categoryInput.value = '0';

    addPhotoElement.style.display = 'flex';
    formatPhotoElement.style.display = 'flex';

    // Réinitialisation des classes des éléments nécessaires

    uploadWorksImage.classList.add('upload-works-img');

  };





  
// CONTENU EN FONCTION DE L'ETAT DE CONNEXION

  // Afficher ou masquer le contenu en fonction de l'état de connexion

const tokenContent = sessionStorage.getItem('token');
const privateContent = document.querySelectorAll('.privateContent');


if (tokenContent) {
  privateContent.forEach (element => {
    element.style.display = 'flex';

  });
} else {
  privateContent.forEach(element => {
    element.style.display = 'none';
  });
  displayButton();
}

// Quand l'utilisateur est connecté

// Récupération du token stocké dans sessionStorage dans la variable token
const verifyTokenIsPresent = () =>  {
    const login_button = document.getElementById("id_login_button");
    if(token) {
    login_button.textContent = "logout";
    login_button.addEventListener("click", () => {
      window.sessionStorage.removeItem("token");
      login_button.textContent = "login";
      window.location.href = '../login.html';
    });
  }}

  verifyTokenIsPresent();

// Bande mode édition

const header = document.querySelector(".header");
const adminDiv = document.querySelector(".banner-admin");
const adminP = document.createElement("p");
adminDiv.classList.add("banner-admin");
adminP.classList.add("banner-p");
adminP.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
adminDiv.appendChild(adminP);
header.appendChild(adminDiv);