
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeDetail.id}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.stats)
        .then((stats) => {
            const pokemon = new Pokemon();
            const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
            const [type1] = types;
            
            pokemon.number = pokeDetail.id;
            pokemon.name = pokeDetail.name;
            pokemon.types = types;
            pokemon.type = type1;
            pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
            pokemon.hp = stats[0].base_stat;
            pokemon.attack = stats[1].base_stat;
            pokemon.defense = stats[2].base_stat;
            return pokemon;
        })
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
