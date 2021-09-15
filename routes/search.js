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

  //Navbar según estado Logged o Logout
    let user
    if(req.session.user){
       user = req.session.user
    }

  ///------///  

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

        Promise.all([artistsNameSearch, totalArtistsArr, user])
          .then(([artistsNameSearch, totalArtistsArr, user]) => res.render('search/artists-search-results', {artistsNameSearch, totalArtistsArr, user}))
  }) 


// Get Artist's Album

router.get('/albums/:artistId', (req, res, next) => {

//Navbar según estado Logged o Logout
  let user
  if(req.session.user){
    user = req.session.user
  }
///------///  

  let artistID = req.params.artistId;

  let totalAlbumsArr = spotifyApi
                            .getArtistAlbums(artistID)
                            .then(album => {
                               let totalAlbumsArr = (album.body.items)
                               return totalAlbumsArr
                              })
  Promise.all([totalAlbumsArr, user])
          .then(([totalAlbumsArr, user]) => res.render('search/albums', {totalAlbumsArr, user})) 
    });

// Get Tracks

router.get('/tracks/:albumID', (req, res, next) => {

  //Navbar según estado Logged o Logout
  let user
  if(req.session.user){
    user = req.session.user
  }
///------///  


  let albumID = req.params.albumID;

  let tracksArr = spotifyApi
                      .getAlbumTracks(albumID)
                      .then(track => {
                           let tracksArr = (track.body.items)
                          return tracksArr
       })
    Promise.all([tracksArr, user])
         .then(([tracksArr, user]) => res.render('search/tracks', {tracksArr, user})) 
})

// Get Lyrics

router.get('/lyric/:artistName/:trackName', (req, res) => {

   //Navbar según estado Logged o Logout
   let user
   if(req.session.user){
     user = req.session.user
   }
 ///------///  

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
          console.log (artistName)
          console.log("ERROR: ", err)
        })

        Promise.all([artistName, trackName, lyric, user])
          .then(([artistName, trackName, lyric, user]) => res.render("search/lyrics", {artistName, trackName, lyric, user}))
})



module.exports = router;