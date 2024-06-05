let loadedPokemon = []; // Globale Variable zum Speichern der geladenen Pokémon
let pokemonPackage = 0;
let pokemonImg = [];
let pokeImgGif = [];




  function init() {
   getPokemonData();

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

function renderPokemonData() {
  let mainContent = document.getElementById("main_content");
  for (let z = pokemonPackage; z < loadedPokemon.length; z++) {
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

function loadMorePokemon() {
  getPokemonData(); // Weitere Pokémon laden
}



function blurBackground () {
  document.getElementById('single_card_background').classList.remove('d-none');
  document.getElementById('main_content').classList.add('blur');
  document.getElementById('single_pokemon_card').classList.remove('d-none')
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
  <div class="single-pokemon-card-img ${pokeTypeBackground}"> <img src="${pokeGif.url}"></div>
  <div class="pokemon-stats-container ${pokeTypeBackground+"2"}">
    <div class="stat-line">
      <div id="close_up_info_btn_1">Stats</div>
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


  