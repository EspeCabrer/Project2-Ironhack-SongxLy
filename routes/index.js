const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {

  console.log(req.session)

  if(req.session.user){
    const user = req.session.user
    res.render("index", {user});
  }
  else {
  res.render("index");
  }
});

router.get("/search", (req, res, next) => {
  
  if(req.session.user){
    const user = req.session.user
    res.render("search/search", {user});
  }
  else {
  res.render("search/search");
  }
})

module.exports = router;
