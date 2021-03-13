const express = require('express');
const axios = require('axios');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'assets')));

let breeds = [];
app.get('/', async (req, res) => {
  const response = await axios.get('https://dog.ceo/api/breeds/list/all');
  const _breeds = response.data.message;
  breeds = Object.keys(_breeds);
  res.render('index', { breeds });
});

app.get('/breeds/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://dog.ceo/api/breed/${id}/images`);
    const images = response.data.message;
    res.render('breeds', { breedName: id, breeds, images });
  } catch(err) {
    console.log(err);
    res.render('breeds', { breedName: id, breeds, images : [] });
  }
});

app.listen(PORT);

console.log('Listening on port : ' + PORT);
