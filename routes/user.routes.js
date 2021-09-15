const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");

const LyricsApi = require("../services/ApiLyrics");
const lyricsApi = new LyricsApi()

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

///Visualizar favoritos al perfil del usuario////

router.get("/profile", isLoggedIn, (req, res, next) =>{

    User.findById(req.user._id)
        .then((user) => {
                let userTracks = user.favorites
                res.render("profile", {userTracks});
         })
   
  
  })


/// Añadir canción a favoritos

 router.post("/favorites/add", isLoggedIn, (req, res)=> {

    const {name, artist} = req.body

    let nameCleaned = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    let artistCleaned = artist.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  

    User
        .find({_id: req.user._id})
        .then((users) => {
            let user = users[0]
            console.log("USER" , user)
            console.log(user.favorites[0]);

            for(let i = 0; i < user.favorites.length; i++) {

                //Comprobar si la canción ya existe en favoritos
                
                if (user.favorites[i].name === name && user.favorites[i].artist === artist) {
                         console.log("This song ya exists!")
                         return;
                        } 
                }
            User
                .findOneAndUpdate({_id: req.user._id},{$push : {favorites : {name: name, artist: artist}}})
                .then(()=> console.log("UPDATED"))
                .catch((err) => console.error(err));
                })        
        .catch((err) => { console.log("ERROR: ", err)})
 }); 



    
    
     router.post("/favorites/delete",isLoggedIn,(req,res)=>{
        const {name, artist} = req.body
        
        User
            .findByIdAndUpdate(req.user._id,{$pull : {favorites : {name, artist}}})
            .then(()=>{
                res.redirect("/profile")
        })
        .catch(err => console.log(err))
    })  

module.exports = router;