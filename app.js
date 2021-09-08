require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //possible due to .env package 
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
// 1. Create a route /index, which will render a view called index.hbs
// Create a form with artistName field, should redirect to /artist-search with a query string localhost:3000?artistName="blahblahblah"
app.get('/', (req, res) => {
    res.render('index');
  });
  


//2. Create an /artist-search-route which gets the artist name from quert params and passes it to the spotify API

app.get('/artist-search', async (req, res) => {

   try {
     const searchData = await spotifyApi
      .searchArtists(req.query.artist)
      console.log('The received data from the API: ', searchData.body.artists);
      const allArtists = searchData.body.artists.items;
      res.render('artist-search-results', {allArtists});
      
      
  }  catch (e) {
    console.log("error occured retrieving artist data")
  } 
  
})

app.get("/albums/:artistId" , async (req, res) => {

    try {
    const data = await spotifyApi.getArtistAlbums(req.params.artistId);
    console.log(data.body)
    const allAlbums =  data.body.items
    res.render('albums', {allAlbums})

} catch (e) {
    console.log("error occured retrieving album data")
  } 
});


app.get("/albums/tracks/:albumId", async (req, res) => {

    try {
    const data = await spotifyApi.getAlbumTracks(req.params.albumId)
    console.log(data.body)
    const allTracks = data.body.items
    res.render('tracks', {allTracks})
}
 catch (e) {
    console.log("error occured retrieving track data")
  } 
       
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
