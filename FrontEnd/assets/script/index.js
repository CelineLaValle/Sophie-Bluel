// (async() => {
//     console.log('before start');
  
//     const reponse = await fetch('http://localhost:5678/api/works');
//     const works = await reponse.json();
    
//     console.log(works);
//   })();

//   const works = document.querySelector('.gallery');

//   async function displayWorks() {
//     const arrayWorks - await getWorks();
//     works.forEach(function(work) {
//     const figure = document.createElement('figure');
//     let img = document.createElement('img');
//     let figcaption = document.createElement('figcaption');
//     img.src = work.imageUrl;
//     figcaption.textContent = work.title;
//     figure.classList.add("gallery");
//     works.appendChild(figure);
//     works.appendChild(img);
//     works.appendChild(figcaption);
//   })}

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
