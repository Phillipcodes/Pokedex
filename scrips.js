let loadedPokemon = []; // Globale Variable zum Speichern der geladenen Pokémon
let pokemonPackage = 0;
let pokemonImg = [];
let pokeImgGif = [];
let lastRenderedIndex = 0;

async function init() {
  loadingSpinner();
  await getPokemonData();
  disableLoadingSpinner();

}

function searchPokemonName() {
  let search = document.getElementById('search').value;
  search = search.toLowerCase();
  let mainContent = document.getElementById("main_content");

  // Reset the content and the lastRenderedIndex
  document.getElementById('btn').classList.add('d-none')
  mainContent.innerHTML = '';
  lastRenderedIndex = 0;

  if(search === "") {
    document.getElementById('btn').classList.remove('d-none')
  }

  for (let z = 0; z < loadedPokemon.length; z++) {
    let pokemon = loadedPokemon[z];
    let pokemonName = pokemon.name;
    let uppercasePokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let pokeTypesHTML = "";
    
    if (pokemonName.toLowerCase().startsWith(search)) {
      for (let j = 0; j < pokemon.types.length; j++) {
        let pokeType = pokemon.types[j].type.name;
        let uppercasePokeType = pokeType.charAt(0).toUpperCase() + pokeType.slice(1);
        pokeTypesHTML += `<span class="poke-type ${pokeType}1 center-text font-bold">${uppercasePokeType}</span> `;
      }
      let pokeTypeClass = pokemon.types[0].type.name;
      let pokeHtml = renderPokemonDataHTML(uppercasePokemonName, z + 1, z, pokeTypesHTML, pokeTypeClass);
      mainContent.innerHTML += pokeHtml;
    }
  }
  lastRenderedIndex = loadedPokemon.length;
}

async function getPokemonData() {
  for (let i = pokemonPackage +1 ; i < pokemonPackage +13; i++) {
    try {
      let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      let baseImgUrl =  await fetch (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`);
      let baseGifUrl =  await fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${i}.gif`);
      if (!pokemonResponse.ok) {
        throw new Error("Something went wrong.");
      }
      let pokemonData = await pokemonResponse.json();
      pokemonImg.push(baseImgUrl)
      pokeImgGif.push(baseGifUrl)
      loadedPokemon.push(pokemonData); // Pokémon zur Liste der geladenen Pokémon hinzufügen
      
    } catch (error) {
      console.log("Es ist ein Fehler aufgetreten.");
    }
  }

  renderPokemonData()
  
  pokemonPackage += 13;

}


function loadingSpinner () {
  document.getElementById('body').innerHTML += `
   <div class="loading_spiner" id="loading_spiner"><img src="./loadin.gif">
    <span>loading....</span>
    gotta catch em all
   </div>
   `
   if(loadedPokemon.length === 0) {
    document.getElementById('header').classList.add('d-none')
    document.getElementById('btn-container').classList.add('d-none')
    
   }
   

}

function disableLoadingSpinner() {
  document.getElementById('loading_spiner').classList.add('d-none')
  document.getElementById('main_content').classList.remove('blur')
  document.getElementById('header').classList.remove('blur')
  document.getElementById('header').classList.add('d-none')
  document.getElementById('header').classList.remove('d-none');
  document.getElementById('single_card_background').classList.add('d-none');
  document.getElementById('btn-container').classList.remove('d-none')
 
  
}

function renderPokemonData() {
  let mainContent = document.getElementById("main_content");
 

  for (let z = lastRenderedIndex; z < loadedPokemon.length; z++) {
    let pokemon = loadedPokemon[z];
    let pokemonName = pokemon.name;
    let uppercasePokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    let pokeTypesHTML = "";
    
    
    for (let j = 0; j < pokemon.types.length; j++) {
      let pokeType = pokemon.types[j].type.name;
      let uppercasePokeType = pokeType.charAt(0).toUpperCase() + pokeType.slice(1);
      pokeTypesHTML += `<span class="poke-type ${pokeType}1 center-text font-bold">${uppercasePokeType}</span> `;
    }
    let pokeTypeClass = pokemon.types[0].type.name;
    let pokeHtml = renderPokemonDataHTML(uppercasePokemonName,  z+ 1 , z, pokeTypesHTML,pokeTypeClass);
    mainContent.innerHTML += pokeHtml;
  }
  lastRenderedIndex = loadedPokemon.length;

}

function renderPokemonDataHTML(pokeName,  id, noneFormattedId, pokeTypesHTML,pokeTypeClass) {
  
  return `<div class="pokecard"  onclick="openSinglePokemonCard(${noneFormattedId})">
    <div id="poke_name" class="poke-name center-text ${pokeTypeClass} ">
      <div class="display-row">
        <h2>${pokeName}</h2>
        <div class="center-number">${id}</div>
      </div>
      <div id="poke_body" class="poke-body">
        <img src="${pokemonImg[noneFormattedId].url}" alt="">
      </div>
      <div id="poke_type" class="center-text font-bold">
        ${pokeTypesHTML}
      </div>
    </div>
  </div>
  `;
}

 async function loadMorePokemon() {
  
  loadAnimationSpinnerBtn();
 await getPokemonData(); // Weitere Pokémon laden
 disableLoadingSpinnerAnimationBtn();

}

function loadingSinnerForLoadManually() {
  document.getElementById('loading_spiner').classList.remove('d-none')

  blurBackgroundLoadingSpinner();
}

function blurBackground () {
  document.getElementById('single_card_background').classList.remove('d-none');
  document.getElementById('main_content').classList.add('blur');
  document.getElementById('single_pokemon_card').classList.remove('d-none')
  document.getElementById('header').classList.add('blur');
}

function blurBackgroundLoadingSpinner () {
  document.getElementById('single_card_background').classList.remove('d-none');
  document.getElementById('main_content').classList.add('blur');
  document.getElementById('header').classList.add('blur');
 
}


function openSinglePokemonCard(id) {
  document.getElementById('body').classList.add('no-scroll')
  renderSinglePokemonCard(id)
  blurBackground ()
  renderStatsInfoAtStart(id)
  
  
}

function renderSinglePokemonCard(id) {
  let pokemonName = loadedPokemon[id].name;
  let uppercasePokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1); 
  let pokeGif = pokeImgGif[id];
  let pokeyTypeBG = loadedPokemon[id].types[0].type.name;
  document.getElementById('single_pokemon_card_container').innerHTML = renderSinglePokemonCardHTML(id,uppercasePokemonName, pokeGif,pokeyTypeBG)
 
}

function renderSinglePokemonCardHTML(id ,uppercasePokemonName,pokeGif,pokeTypeBackground) {
  return /*html*/`  
  <div id="single_pokemon_card" class="single-pokemon-card d-none">
  <div class="name-and-id-line ${pokeTypeBackground+"3"}">
    <div class="center-name">${uppercasePokemonName}</div>
    <div class="round-background">${id+1}</div>
  </div>
  <div class="single-pokemon-card-img ${pokeTypeBackground}">
        <div onclick="previousPokemon(${id})" id="click-forward"> <</div>
        <img src="${pokeGif.url}">
        <div onclick="nextPokemon(${id})" id="click-backward"> > </div>
      
  </div>
  <div class="pokemon-stats-container ${pokeTypeBackground+"2"}">
    <div class="stat-line">
      <div  onclick="renderStatsInfo(renderPokeStats(${id}),${id})" onclick="openStatsTab(event)" id="close_up_info_btn_1">Stats</div>
      <div  onclick="renderStatsInfo(renderMoves(${id}),${id})" id="close_up_info_btn_2">Moves</div>
      <div  onclick="renderStatsInfo(renderAboutPokemon(${id}),${id})"id="close_up_info_btn_3">Info</div>
    </div>
    <div class="seperator"></div>
    <div id="poke_stats${id}" class="stats-information">
 
    </div>
  </div>
</div>`
  
}

function closePokemonCard() {
  document.getElementById('single_card_background').classList.add('d-none');
  document.getElementById('main_content').classList.remove('blur');
  document.getElementById('single_pokemon_card').classList.add('d-none')
  document.getElementById('header').classList.remove('blur');
  document.getElementById('body').classList.remove('no-scroll');
}
 

async function nextPokemon(id) {
  if (id < loadedPokemon.length - 1) { // Wenn es ein nächstes Pokémon gibt
    id = id + 1; // Erhöhe die ID, um das nächste Pokémon anzuzeigen
    openSinglePokemonCard(id);
  } else { // Wenn das Ende der geladenen Pokémon erreicht ist
    loadingSinnerForLoadManually();
    document.getElementById('single_pokemon_card').classList.add('d-none');
    await getPokemonData(); // Lade weitere Pokémon
    id = id + 1; // Inkrementiere die ID
    disableLoadingSpinner();
    removeDisplayNone();
    openSinglePokemonCard(id); // Öffne das nächste Pokémon
  }
}

function previousPokemon(id) {
  if (id > 0) { // wenn i im array kleiner 0 ist dann öffne nächsts bild von i länge minus 1 also rückwärts
    openSinglePokemonCard(id - 1);
  } else { // wenn nicht ist i = images-length -1 sprich er ist dann beim näcshten klick von null auf 15
    id = loadedPokemon.length - 1;
    openSinglePokemonCard(id);
  }
  
}

function openStatsTab(event) {
  event.stopPropagation();
}


function removeDisplayNone() {
  document.getElementById('single_pokemon_card').classList.remove('d-none');
}


function renderStatsInfo(functions,id) {
  let statsContainer = document.getElementById(`poke_stats${id}`);
  statsContainer.innerHTML = ""
  statsContainer.innerHTML = functions
}

function renderStatsInfoAtStart(id) {
  let statsContainer = document.getElementById(`poke_stats${id}`);
  statsContainer.innerHTML = ""
  statsContainer.innerHTML = renderPokeStats()
}

function renderMoves(id)  {
  let pokemon = loadedPokemon[id]
return /*html*/`
<span>${pokemon.moves[0].move.name}</span>
<span>${pokemon.moves[1].move.name}</span>
<span>${pokemon.moves[2].move.name}</span>
<span>${pokemon.moves[3].move.name}</span>
<span>${pokemon.moves[4].move.name}</span>
<span>${pokemon.moves[5].move.name}</span>
   `

}

function renderPokeStats(id) {
return` hallo 2`
}

function renderAboutPokemon(id) {
  return` hallo 3`
}

function loadAnimationSpinnerBtn() {
  let animationContainer = document.getElementById('animation');
  animationContainer.innerHTML = ""; 
  document.getElementById('btn').classList.add('d-none');
  document.getElementById('text_animation').classList.remove('d-none');
  document.getElementById('load_more_span').classList.add('d-none');
    animationContainer.innerHTML += `
      <img class="loading-bg" src="./pokeballLoad.gif" alt="Loading Animation" class="loading-animation">
    `;
    animateText();
  }


function disableLoadingSpinnerAnimationBtn () {
  let animationContainer = document.getElementById('animation');
  animationContainer.innerHTML = "";
  document.getElementById('btn').classList.remove('d-none')
  document.getElementById('text_animation').classList.add('d-none')
  document.getElementById('load_more_span').classList.remove('d-none');
}


const text = "gotta catch em all!";
const interval = 75; // Intervall in Millisekunden

function animateText() {
  const container = document.getElementById('text_animation');
  container.innerHTML = ""
  // Funktion zur Anzeige eines Buchstabens nach einer Verzögerung
  function showLetter(index) {
      if (index < text.length) {
          container.textContent += text[index];
          setTimeout(() => showLetter(index + 1), interval);
      }
  }

  // Start der Animation mit dem ersten Buchstaben
  showLetter(0);
}