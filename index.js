const express = require('express');
const axios = require('axios');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'assets')));

let breeds = [];
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
app.get('/', async (req, res) => {
  const response = await axios.get('https://dog.ceo/api/breeds/list/all');
  const _breeds = response.data.message;
  breeds = Object.keys(_breeds).map(b => {
    const subBreeds = _breeds[b].length;
    const name = subBreeds > 0 ? `${capitalize(b)} (${_breeds[b].length})` : capitalize(b);
    return {
      id: b,
      name,
      subBreeds: subBreeds > 0
    }
  });
  res.render('index', { breeds });
});

app.get('/breeds/sub/:id', async (req, res) => {
  const { id } = req.params;
  let subBreeds = [];
  try {
    const response = await axios.get(`https://dog.ceo/api/breed/${id}/list`);
    subBreeds = response.data.message.map(s => {
      return {
        breed: id,
        id: s,
        name: capitalize(s)
      };
    });
  } catch(err) {
    console.log(err);
  }
    res.render('list-sub-breeds', { breedName: capitalize(id), breeds, subBreeds });
});

app.get('/breeds/:id', async (req, res) => {
  const { id } = req.params;
  let images = [];
  try {
    const response = await axios.get(`https://dog.ceo/api/breed/${id}/images`);
    images = response.data.message;
  } catch(err) {
    console.log(err);
  }
    res.render('breeds', { breedName: capitalize(id), breeds, images });
});

app.get('/subbreeds/:breed/:id', async (req, res) => {
  const { breed, id } = req.params;
  let images = [];
  try {
    const response = await axios.get(`https://dog.ceo/api/breed/${breed}/${id}/images`);
    images = response.data.message;
  } catch(err) {
    console.log(err);
  }

  res.render('sub-breeds', { 
    breed,
    breedName: capitalize(breed), 
    subBreed: capitalize(id),
    breeds, 
    images 
  });

});


app.listen(PORT);

console.log('Listening on port : ' + PORT);
