const axios = require('axios'),
      url = `https://api.pokemontcg.io/v1/cards`;
      
axios.get(url)
    .then((response) => {
        const cards = JSON.parse(response.data);
        console.log(cards.lenght);
    }).catch(function (e) {
    console.log(e);
});