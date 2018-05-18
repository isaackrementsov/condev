//required modules
var session = require('express-session');
var helmet = require('helmet');
var expressValidator = require('express-validator');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require('./routes');
var rateLimiter = require('express-rate-limit');
var fs = require('fs');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
mongoose.connect('mongodb://127.0.0.1:27017/condev');
mongoose.connection.on('open', function(err){
    if(err){
        fs.writeFile('../../logs/db.json', err, function(err){})
    }
});
//Module middleware or setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
//Prevent website being copied in <iframe> HTML elements
app.use(helmet({frameguard: {action: 'deny'}}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Cookie settings
app.use(session({
  secret: 'yVVma9ga',
  saveUninitialized: true,
  resave: true,
  cookie: {httpOnly: true}
}));
//Set up form checking
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}));
//Limits requests to 37 over 37.5 seconds (about 1 per second) to prevent DOS attacks
var limiter = new rateLimiter({
  windowMs: 5*7.5*1000,
  max: 37,
  delayMs: 1
});
app.use(limiter);
app.use(methodOverride());
String.prototype.toTitle = function(){
  var str = this.split('');
  str[0] = str[0].toUpperCase();
  return str.join('')
}
Date.prototype.timeAgo = function(){
  var seconds = ((new Date() - this) / 1000);
  var interval = (seconds / 31536000);
  if(interval > 1) return Math.floor(interval) + ' years';
  interval = Math.floor(seconds / 2592000);
  if(interval > 1) return Math.floor(interval) + ' months';
  interval = (seconds / 86400);
  if(interval > 1) return Math.floor(interval) + 'd';
  interval = (seconds / 3600);
  if(interval > 1) return Math.floor(interval) + 'h';
  interval = (seconds / 60);
  if(interval > 1) return Math.floor(interval) + 'm';
  return Math.floor(seconds) + 's';
}
Date.prototype.format = function(){
  return this.getMonth() + '/' + this.getDate() + '/' + this.getFullYear()
}
Array.prototype.search = function(property, term){
  var objArr = [];
  for(var i = 0; i < this.length; i++){
    objArr.push(this[i][property])
  }
  return objArr.indexOf(term)
}
String.prototype.fix = function(){
  return this.trim().toLowerCase()
}
//Tell app to listen on port 3000
app.listen(app.get('port'), function(err){
  if(err){
      fs.writeFile('../../logs/app.json', err, function(err){})
  }
});
//IMPORTANT; sends requests to app to routes module in server folder
routes(app)