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

/* Fonction qui affiche les travaux */
async function displayWorks() {
  const arrayWorks = await getWorks();
  console.log(arrayWorks);
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
  console.log(categories);
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
  console.log(buttons);
  /* On itère sur les boutons */
  buttons.forEach(btn => {
    /* On ajoute un évènement sur chaque bouton */
    btn.addEventListener('click', (e) => {
      const category = e.target.getAttribute('category');
      console.log(category);
      filtersWorks(category);
    })
     })
    
}


/* Fonction pour trier */

/* Récupération de category par ma fonction filtersWorks(category) => filterWorks(categoryBtn) */
function filtersWorks(categoryBtn) {
  const allWorks = works.querySelectorAll('figure');
  console.log(allWorks)
  /* Itère sur les figures */
  allWorks.forEach(figure => {
    console.log(figure.getAttribute('category'));
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
adminP.innerHTML = 'Mode édition <i class="fa-solid fa-xmark"></i>';
adminDiv.appendChild(adminP);
header.appendChild(adminDiv);

// Fonction modal

const dialog = document.querySelector(".modal");
const showButton = document.querySelector(".button_modal");
const closeButton = document.querySelector(".button_close");

// Le bouton "Afficher la fenêtre" ouvre le dialogue
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// Le bouton "Fermer" ferme le dialogue
closeButton.addEventListener("click", () => {
  dialog.close();
});

async function displayWorksModal() {
  const arrayWorks = await getWorks();
  arrayWorks.forEach(element => {
    const figure = document.createElement('figure');
    figure.classList.add("thumbnail");
    const img = document.createElement('img');
    const modalWorks = document.querySelector('.modalWorks');
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
      console.log("La suppression n'a pas fonctionnée");
    } else {
      console.log("La suppression a fonctionnée");
      figure.remove();
      const figuresGallery = document.querySelector('.gallery');
      const figuresLarges = figuresGallery.querySelectorAll('figure');
      console.log(figuresLarges);
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