//required modules
var session = require("express-session");
var helmet = require("helmet");
var expressValidator = require("express-validator");
var mongoose = require("mongoose");
var path = require("path");
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser = require('body-parser');
var ejs = require('ejs');
var routes = require('./routes');
var rateLimiter = require("express-rate-limit");
//Prevent website being copied in <iframe> HTML elements
app.use(helmet({
  frameguard: {action: "deny"}
}));
//Module middleware or setup
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/condev");
//Tell app to listen on port 3000
app.listen(app.get('port'), function(){
  console.log("server started");
});
var db = mongoose.connection;
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
String.prototype.toTitle = function(){
  var str = this.split("");
  str[0] = str[0].toUpperCase();
  return str.join("")
}
Date.prototype.timeAgo = function(){
  var seconds = Math.floor((new Date() - this) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if(interval > 1) return interval + " years";
  interval = Math.floor(seconds / 2592000);
  if(interval > 1) return interval + " months";
  interval = Math.floor(seconds / 86400);
  if(interval > 1) return interval + "d";
  interval = Math.floor(seconds / 3600);
  if(interval > 1) return interval + "h";
  interval = Math.floor(seconds / 60);
  if(interval > 1) return interval + "m";
  return Math.floor(seconds) + "s";
}
Date.prototype.format = function(){
  return this.getMonth() + "/" + this.getDate() + "/" + this.getFullYear()
}
Array.prototype.search = function(property, term){
  var objArr = [];
  for(var i = 0; i < this.length; i++){
    objArr.push(this[i][property])
  }
  return objArr.indexOf(term)
}
Array.prototype.objects = function(property){
  var objArr = [];
  for(var i = 0; i < this.length; i++){
    objArr.push(this[i][property])
  }
  return objArr
}
String.prototype.fix = function(){
  return this.trim().toLowerCase()
}
Array.prototype.mSearch = function(property, term){
  var objArr = [];
  for(var i = 0; i < this.length; i++){
    objArr.push(this[i][property])
  }
  return objArr.mIndex(term)
}
Array.prototype.mIndex = function(term){
  var results = [];
  for(var i = 0; i < this.length; i++){
    if(this[i] == term){
      results.push(i)
    }
  }
  return results
}
Array.prototype.mSelect = function(arr){
  array = [];
  for(var i = 0; i < arr.length; i++){
    array.push(this[arr[i]])
  }
  return array
}
//IMPORTANT; sends requests to app to routes module in server folder
routes(app);