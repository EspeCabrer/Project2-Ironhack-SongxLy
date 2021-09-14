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
    const artistsNameSearch = artistObj.artist

    let totalArtistsArr = spotifyApi
                                .searchArtists(artistsNameSearch)
                                .then(data => {

                                let totalArtistsArr = (data.body.artists.items)

                                console.log(totalArtistsArr)

                                return totalArtistsArr
        })
        .catch(err => console.log('The error while searching artists occurred: ', err))

        Promise.all([artistsNameSearch, totalArtistsArr])
          .then(([artistsNameSearch, totalArtistsArr]) => res.render('search/artists-search-results', {artistsNameSearch, totalArtistsArr}))
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

// Get Tracks

router.get('/tracks/:albumID', (req, res, next) => {
  let albumID = req.params.albumID;

  spotifyApi
          .getAlbumTracks(albumID)
          .then(track => {

              let tracksArr = (track.body.items)
              console.log(tracksArr)
             res.render('search/tracks', {tracksArr})
       })

})

// Get Lyrics

router.get('/lyric/:artistName/:trackName', (req, res) => {

  let artistName = req.params.artistName;
  let trackName = req.params.trackName;

  let artistNameClean = artistName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  let trackNameClean = trackName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


  let lyric = lyricsApi
                    .getLyrics(artistNameClean, trackNameClean)
                    .then(lyricObj => {

                    const lyric = lyricObj.data.lyrics;
         /*  console.log("lyricObj: ",lyricObj.data) */

         /*  const replaced = lyric.replace(/\n/g, '<br >')
          console.log("replaced :", replaced) */

                      return lyric

         /*  res.render('search/lyrics', {lyric}) */
        })
        .catch(err => {
          console.log (artistNameClean)
          console.log("ERROR: ", err)
        })

        Promise.all([artistName, trackName, lyric])
          .then(([artistName, trackName, lyric]) => res.render("search/lyrics", {artistName, trackName, lyric}))
})



module.exports = router;