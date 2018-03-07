var dbFind = require("../core/dbFind");
var dbCreate = require("../core/dbCreate");
var dbUpdate = require("../core/dbUpdate");
var ObjectId = require('mongodb').ObjectID;
module.exports = {
    index: function(req,res){
        res.render("home", {session:req.session})
    },
    renderLogin: function(req,res){
        res.render("login", {session:req.session})
    },
    search: function(req,res){
        req.session.search = req.body.search.split(" ");
        res.redirect("/search")
    },
    login: async function(req,res){
        var user = await dbFind.findUser({'username':req.body.username.trim(), 'password':req.body.password});
        if(user){
            req.session.userId = user._id;
            req.session.dev = user.dev;
            req.session.user = user.username;
            req.session.gravName = user.gravatar;
            if(user.dev){
                res.redirect('/devs/' + req.session.user)
            }else{
                res.redirect('/clients/' + req.session.user)
            }
        }else{
            req.session.err = ["Incorrect credentials"];
            res.redirect("/login")
        }
    },
    renderSignup: function(req, res){
        res.render("signup", {session:req.session})
    },
    signup: function(req,res){
        var User = require("../models/users");
        var dev;
        if(req.body.dev == "true"){
            var dev = true
        }else{
            var dev = false
        }
        dbCreate.newUser({username:req.body.username.trim(), password:req.body.password, dev:dev, gravatar:req.file.filename}, function(err, saved){
            if(err){
                req.session.err = ["Please use a unique username"];
                res.redirect("/signup")
            }else{
                res.redirect("/login")
            }
        })
    },
    logout: function(req,res){
        req.session.destroy();
        res.redirect("/login")
    },
    update: function(req,res){
        if(req.params.attr == "lang" && req.session.dev){
            dbUpdate.updateUser({'username':req.session.user}, {$push:{'languages':{'name':req.body.language}}});
        }else if(req.params.attr == "bio"){
            dbUpdate.updateUser({'username':req.session.user}, {'bio':req.body.description})
        }
        var dev = req.session.dev ? "devs" : "clients";
        res.redirect("/" + dev + "/" + req.session.user)
    },
    any: function(req,res){
        res.render("404", {session:req.session})
    }
}