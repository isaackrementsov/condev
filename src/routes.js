var router = require("express").Router();
var multer = require("multer");
var path = require("path");
var home = require("./endpoints/home");
var client = require("./endpoints/client");
var dev = require("./endpoints/dev");
var websites = require("./endpoints/websites");
var search = require("./endpoints/search");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
        console.log(file.originalname)
  }
}); 
var upload = multer({ storage: storage });
module.exports =  function(app){
    app.use("/", router);
    router.get("/", home.index);
    router.get("/login", home.renderLogin);
    router.post("/login", home.login);
    router.get("/signup", home.renderSignup);
    router.post("/signup", upload.single('avatar'), home.signup);
    router.post("/", home.search);
    router.post("/logout", home.logout);
    router.get("/clients/:username", client.index);
    router.get("/client/websites", websites.index);
    router.post("/websites/create", websites.create);
    router.get("/websites/:websiteId", websites.show);
    router.post("/websites/update:websiteId/:attr", websites.update);
    router.post("/websites/delete:websiteId", websites.delete);
    router.get("/search", search.index);
    router.get("/devs/:username", dev.index);
    router.get("/:any", home.any)
}
