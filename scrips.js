let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
let loadedPokemon = []; // Globale Variable zum Speichern der geladenen Pokémon
let pokemonPackage = 24
function init() {
  fetchPokemonData();
}

async function fetchPokemonData() {
  try {
    let pokemon = await fetch(BASE_URL);

    if (!pokemon.ok) {
      throw new Error("Something went wrong.");
    }

    let pokemonAsJson = await pokemon.json();
    await getPokemonData(pokemonAsJson.results);
    console.log(pokemonAsJson);
  } catch (error) {
    console.log("we went into an error.");
  }
}

async function getPokemonData(pokemonAsJson) {
  for (let i = 0; i < pokemonPackage; i++) {
    let pokemonName = pokemonAsJson[i]["name"];
    // Überprüfen, ob das Pokémon bereits geladen wurde
    if (!loadedPokemon.includes(pokemonName)) {
      try {
        let pokemonInfo = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );

        if (!pokemonInfo.ok) {
          throw new Error("Something went wrong.");
        }

        let pokemonInfoAsJson = await pokemonInfo.json();
        renderPokemonData(pokemonName, i + 1, pokemonInfoAsJson.types);
        loadedPokemon.push(pokemonName); // Pokémon zur Liste der geladenen Pokémon hinzufügen
        console.log(pokemonInfoAsJson);
      } catch (error) {
        console.log("we went into an error.");
      }
    }
  }
}

function renderPokemonData(pokemonName, index, types) {
  let baseImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  let uppercasePokemonName =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  let pokeTypesHTML = "";
  let pokeType = types[0].type.name; // Annahme: Das erste Element in den Typen ist der Haupttyp
  for (let j = 0; j < types.length; j++) {
    let pokeTyp = types[j].type.name;
    let UppercasePokeType =
      pokeTyp.charAt(0).toUpperCase() + pokeTyp.slice(1);
    pokeTypesHTML += `<span class="poke-type ${pokeTyp}1 center-text font-bold">${UppercasePokeType}</span> `;
  }

  let pokeHtml = renderPokemonDataHTML( uppercasePokemonName,baseImgUrl,index,pokeType,pokeTypesHTML);

  document.getElementById("main_content").innerHTML += pokeHtml;
}

function renderPokemonDataHTML(pokeName, imageUrl, id, pokeType, pokeTypesHTML) {
  return `<div class="pokecard">
    <div id="poke_name" class="poke-name center-text ${pokeType}">
      <div class="display-row">
        <h2>${pokeName}</h2>
        <div class="center-number">${id}</div>
      </div>
      <div id="poke_body" class="poke-body ${pokeType}">
        <img src="${imageUrl}" alt="">
      </div>
      <div id="poke_type" class="center-text font-bold">
        ${pokeTypesHTML}
      </div>
    </div>
  </div>`;
}
