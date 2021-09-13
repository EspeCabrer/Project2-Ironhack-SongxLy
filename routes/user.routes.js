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
                
                if (user.favorites[i].name === nameCleaned && user.favorites[i].artist === artistCleaned) {
                         console.log("This song ya exists!")
                         return;
                        } 
                }
            User
                .findOneAndUpdate({_id: req.user._id},{$push : {favorites : {name: nameCleaned, artist: artistCleaned}}})
                .then(()=> console.log("UPDATED"))
                .catch((err) => console.error(err));
                })        
        .catch((err) => { console.log("ERROR: ", err)})
 }); 

/* router.post("/add-favorite", isLoggedIn ,(req, res) =>{
    const query = { name, status, species, gender, image, apiId } = req.body
    const idToCheck = req.body.apiId;
        Character.find({apiId: idToCheck})
        .then (charArray => {
            //comprobar si ese apiId ya esta en db characters
            if (charArray.length === 0) {
                Character
                    .create(query)
                    .then(result => {
                      User
                        .findByIdAndUpdate(req.user._id,{$push : {favorites : result._id}})
                        .then(()=>{
                            res.redirect("/characters")
                        })
                    })
                    .catch(err => console.log(err))
            } else {
                User
                .findById(req.user._id)
                .then((user)=>{
                    if (!user.favorites.includes(charArray[0]._id)){
                        User
                        .findByIdAndUpdate(req.user._id,{$push : {favorites : charArray[0]._id}})
                        .then(()=>{
                            res.redirect("/characters")
                        })
                    }else{res.redirect("/characters")}
                })
                .catch((err)=>{
                console.log(err)
                })
                
                
                
            }
        }) 
    })
    
    
    router.post("/delete-favorite",isLoggedIn,(req,res)=>{
        const {id} = req.body
        User.findByIdAndUpdate(req.user._id,{$pull : {favorites : id}})
        .then(()=>{
            res.redirect("/profile")
        })
        .catch(err => console.log(err))
    }) */

module.exports = router;