let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

function init() {
  fetchPokemonData();
}

async function fetchPokemonData() {
  try {
    let pokemon = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0"
    );

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
  for (let i = 0; i < 12; i++) {
    let pokemonName = pokemonAsJson[i]["name"];
    try {
      let pokemonInfo = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );

      if (!pokemonInfo.ok) {
        throw new Error("Something went wrong.");
      }

      let pokemonInfoAsJson = await pokemonInfo.json();
      renderPokemonData(pokemonName, i + 1, pokemonInfoAsJson.types);
      console.log(pokemonInfoAsJson);
    } catch (error) {
      console.log("we went into an error.");
    }
  }
}

function renderPokemonData(pokemonName, index, types) {
  let baseImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  let uppercasePokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
  let pokeTypesHTML = "";
  let pokeTyp = types[0].type.name;
  for(let j = 0; j < types.length; j++) {
    let pokeTyp = types[j].type.name;
    let UppercasePokeType = pokeTyp.charAt(0).toUpperCase() + pokeTyp.slice(1)
    pokeTypesHTML += `<span class="poke-type ${pokeTyp}1 center-text font-bold">${UppercasePokeType}</span> `
  }
  
  
  let pokeHtml =  renderPokemonDataHTML(uppercasePokemonName,baseImgUrl,index,pokeTyp,pokeTypesHTML )

  document.getElementById("main_content").innerHTML += pokeHtml

  
}


function renderPokemonDataHTML(pokeName, imageUrl, id, pokeType,pokeTypesHTML ) {
  return `<div class="pokecard">
    <div id="poke_name" class="poke-name center-text ${pokeType}">
      <div class="display-row">
        <h2>${pokeName}</h2>
        <div class="center-number">${id}</div>
      </div>
      <div id="poke_body" class="poke-body ${pokeType}">
        <img src="${imageUrl}" alt="">
      </div>
      <div id="poke_type" class=" center-text font-bold">
      ${pokeTypesHTML}
      </div>
    </div>
  </div>`;
}
