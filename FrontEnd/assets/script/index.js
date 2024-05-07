(async() => {
    console.log('before start');
  
    const reponse = await fetch('http://localhost:5678/api/works');
    const works = await reponse.json();
    
    console.log(works);
  })();

  const works = document.querySelector('gallery');

  works.forEach(function(work) {
    const figure = document.createElement('figure');
    let img = document.createElement('img');
    let figcaption = document.createElement('figcaption');
    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.classList.add("gallery");
    works.appendChild(figure);
    works.appendChild(img);
    works.appendChild(figcaption);
  })