let loadedPokemon = []; // Globale Variable zum Speichern der geladenen Pokémon
let pokemonPackage = 0;
let pokemonImg = [];
let pokeImgGif = [];
let currentPokemonNames = [];
let lastRenderedIndex = 0;



 async function init() {
    loadingSpinner () 
   await getPokemonData();
   disableLoadingSpinner()
   currentPokemonNames = loadedPokemon;

}


function searchPokemonName() {
  let search = document.getElementById('search').value
  search = search.toLowerCase();
  let pokemonCard = document.getElementById('main_content');
  pokemonCard.innerHTML = "";
console.log(search);
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
      currentPokemonNames.push(pokemonData.name)
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
   }
   

}

function disableLoadingSpinner() {
  document.getElementById('loading_spiner').classList.add('d-none')
  document.getElementById('main_content').classList.remove('blur')
  document.getElementById('header').classList.remove('blur')
  document.getElementById('header').classList.add('d-none')
  document.getElementById('header').classList.remove('d-none');
  document.getElementById('single_card_background').classList.add('d-none');
 
  
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
  </div>`;
}

 async function loadMorePokemon() {
  loadingSinnerForLoadManually();
 await getPokemonData(); // Weitere Pokémon laden
 disableLoadingSpinner()

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
      <div onclick="openStatsTab(event)" id="close_up_info_btn_1">Stats</div>
      <div id="close_up_info_btn_2">Moves</div>
      <div id="close_up_info_btn_3">Info</div>
    </div>
    <div class="seperator"></div>
    <div id="poke_stats" class="stats-information">
      <ul>
        <li class="base-stats-item">
          <span class="base-stat-name">HP</span>
          <span class="base-stat-number">100</span>
        </li>
        <li class="base-stats-item">
          <span class="base-stat-name">Attack</span>
          <span class="base-stat-number">120</span>
        </li>
        <li class="base-stats-item">
          <span class="base-stat-name">Defense</span>
          <span class="base-stat-number">80</span>
        </li>
        <li class="base-stats-item">
          <span class="base-stat-name">Special Attack</span>
          <span class="base-stat-number">90</span>
        </li>
        <li class="base-stats-item">
          <span class="base-stat-name">Special Defense</span>
          <span class="base-stat-number">70</span>
        </li>
        <li class="base-stats-item">
          <span class="base-stat-name">Speed</span>
          <span class="base-stat-number">110</span>
        </li>
      </ul>
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