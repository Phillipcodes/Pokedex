let loadedPokemon = []; // Globale Variable zum Speichern der geladenen Pokémon
let pokemonPackage = 0;
let pokemonImg = [];


  function init() {
   getPokemonData();

}

async function getPokemonData() {
  for (let i = pokemonPackage +1 ; i < pokemonPackage +25; i++) {
    try {
      let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      let baseImgUrl =  await fetch (`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`);
      if (!pokemonResponse.ok) {
        throw new Error("Something went wrong.");
      }
      
      let pokemonData = await pokemonResponse.json();
      
      pokemonImg.push(baseImgUrl)
      loadedPokemon.push(pokemonData); // Pokémon zur Liste der geladenen Pokémon hinzufügen
    } catch (error) {
      console.log("Es ist ein Fehler aufgetreten.");
    }
  }

  renderPokemonData()
  pokemonPackage += 24;

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

function renderPokemonDataHTML(pokeName,  id, imgId, pokeTypesHTML,pokeTypeClass) {
  
  return `<div class="pokecard">
    <div id="poke_name" class="poke-name center-text ${pokeTypeClass} ">
      <div class="display-row">
        <h2>${pokeName}</h2>
        <div class="center-number">${id}</div>
      </div>
      <div id="poke_body" class="poke-body">
        <img src="${pokemonImg[imgId].url}" alt="">
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
