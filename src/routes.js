var router = require('express').Router();
var multer = require('multer');
var path = require('path');
var home = require('./endpoints/home');
var client = require('./endpoints/client');
var ep = require('./endpoints/ep-utils');
var dev = require('./endpoints/dev');
var websites = require('./endpoints/websites');
var search = require('./endpoints/search');
var jobs = require('./endpoints/jobs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
  }
}); 
var upload = multer({ storage: storage });
module.exports =  function(app){
    app.use('/', router);
    router.get('/', search.index);
    router.get('/login', ep.checkUser, home.renderLogin);
    router.post('/login', ep.notEmpty('/login'), home.login);
    router.get('/signup', ep.checkUser, home.renderSignup);
    router.post('/signup', upload.single('avatar'), ep.notEmpty('/signup'), home.signup);
    router.post('/logout', home.logout);
    router.post('/update:attr', ep.checkIn, ep.notEmpty('/!user'), home.update);
    router.get('/clients/:username', client.index);
    router.get('/client/websites', ep.checkClient, websites.index);
    router.post('/websites/create', ep.notEmpty('/client/websites'), ep.checkClient, websites.create);
    router.get('/websites/:websiteId', websites.show);
    router.post('/websites/update:websiteId/:attr', websites.update);
    router.post('/websites/delete:websiteId', websites.delete);
    router.post('/websites/close:websiteId', websites.close);
    router.get('/devs/:username', dev.index);
    router.get('/devHome', ep.checkDev, dev.home);
    router.post('/jobs:jobId/delApp:websiteId/:userName', jobs.delApp);
    router.post('/jobs:jobId/addApp:websiteId/:userName', jobs.addApp);
    router.post('/jobs/create:websiteId', ep.notEmpty('/websites/:websiteId'), jobs.create);
    router.post('/jobs:jobId/apply:websiteId', ep.checkDev, jobs.apply);
    router.get('/:any', home.any)
}