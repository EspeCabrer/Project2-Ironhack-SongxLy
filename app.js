// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config")

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

/* const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error)); */

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const projectName = "sonxLy";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

/* 
app.use((req,res,next) => {
  console.log(req.session)
  console.log(req.user)a
  next()} */
  

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const search = require("./routes/search");
app.use("/", search);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
