const router = require("express").Router();
require("dotenv/config")

const LyricsApi = require("../services/ApiLyrics");
const lyricsApi = new LyricsApi()

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error)); 


// Search artists whose name contains 'artistName'

router.get("/artists", (req, res, next) => {

    const artistObj = req.query
    const artistName = artistObj.artist

    spotifyApi
        .searchArtists(artistName)
        .then(data => {

            let totalArtistsArr = (data.body.artists.items)

            console.log(totalArtistsArr)

           res.render('search/artists-search-results', {totalArtistsArr})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))
  }) 


// Get Artist's Album

router.get('/albums/:artistId', (req, res, next) => {
  let artistID = req.params.artistId;

  spotifyApi
          .getArtistAlbums(artistID)
          .then(album => {

              let totalAlbumsArr = (album.body.items)

              res.render('search/albums', {totalAlbumsArr})
       })
    });

router.get('/tracks/:albumID', (req, res, next) => {
  let albumID = req.params.albumID;

  spotifyApi
          .getAlbumTracks(albumID)
          .then(track => {

              let tracksArr = (track.body.items)
               
             res.render('search/tracks', {tracksArr})
       })

})

// Get Lyrics

router.get('/lyric/:artistName/:trackName', (req, res) => {

  let artistName = req.params.artistName;
  let trackName = req.params.trackName;

  lyricsApi
        .getLyrics(artistName, trackName)
        .then(lyricObj => {

          const lyric = lyricObj.data.lyrics;

          console.log(lyric)

          messagetoSend = lyricObj.data.lyrics.replace("\n", "<br/>")


          res.render('search/lyrics', {lyric})
        })
        .catch(err => console.log(err))

  




})

/* https://api.lyrics.ovh/v1/artist/title */



module.exports = router;