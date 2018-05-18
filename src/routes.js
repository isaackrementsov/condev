var router = require('express').Router();
var multer = require('multer');
var path = require('path');
var home = require('./endpoints/home');
var client = require('./endpoints/client');
var ep = require('./util/ep-utils');
var dev = require('./endpoints/dev');
var websites = require('./endpoints/websites');
var search = require('./endpoints/search');
var jobs = require('./endpoints/jobs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {  
    var cookies = cookie.parse(req.headers.cookie);
    var sid = cookieParser.signedCookie(cookies['connect.sid'], 'yVVma9ga');
    cb(null, Date.now() + sid + path.extname(file.originalname))
  }
}); 
function errorHandler(err,req,res,next){
  res.render('err', {err:err, session:req.session})
}
var upload = multer({storage: storage, limits:{fileSize:10000*1000}});
module.exports =  function(app){
    app.use('/', router);
    router.get('/', search.index);
    router.get('/login', ep.checkUser, home.renderLogin);
    router.post('/login', ep.notEmpty(['username', 'password'], '/login'), home.login);
    router.get('/signup', ep.checkUser, home.renderSignup);
    router.post('/signup', upload.single('avatar'), ep.notEmpty(['username', 'dev', 'password', 'email'], '/signup'), home.signup);
    router.post('/logout', home.logout);
    router.post('/update:attr', upload.single('avatar'), ep.notEmpty(['value'], '/login'), ep.checkIn, home.update);
    router.get('/clients/:username', client.index);
    router.get('/client/websites', ep.checkClient, websites.index);
    router.post('/websites/create', ep.notEmpty(['words', 'description', 'jobData', 'website'],'/client/websites'), ep.checkClient, websites.create);
    router.get('/websites/:websiteId', websites.show);
    router.post('/websites/update:websiteId/:attr', ep.notEmpty(['value'],'/websites/:websiteId'), websites.update);
    router.post('/websites/delete:websiteId', websites.delete);
    router.post('/websites/close:websiteId', websites.close);
    router.get('/devs/:username', dev.index);
    router.get('/devHome', ep.checkDev, dev.home);
    router.post('/jobs:jobId/delApp:websiteId/:userName', jobs.delApp);
    router.post('/jobs:jobId/addApp:websiteId/:userName', jobs.addApp);
    router.post('/jobs/create:websiteId', ep.notEmpty(['name', 'payment'],'/websites/:websiteId'), jobs.create);
    router.post('/jobs:jobId/apply:websiteId', ep.checkDev, jobs.apply);
    router.post('/jobs:jobId/delete:websiteId/:name', ep.checkClient, jobs.delete);
    router.get('/:any', home.any);
    app.use(errorHandler);
}