var dbFind = require("../core/dbFind");
var dbCreate = require("../core/dbCreate")
module.exports = {
    index: async function(req,res){
        res.render("home", {session:req.session})
    },
    renderLogin: async function(req,res){
        res.render("login", {session:req.session})
    },
    search: async function(req,res){
        req.session.search = req.body.search.split(" ");
        res.redirect("/search")
    },
    login: async function(req,res){
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = await req.validationErrors();
        if(errors){
            req.session.err = "Please do not leave forms empty!";
            res.redirect("/login")
        }else{
            var user = await dbFind.findUser({'username':req.body.username, 'password':req.body.password});
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
                req.session.err = "Incorrect credentials";
                res.redirect("/login")
            }
        }
    },
    renderSignup: async function(req, res){
        res.render("signup", {session:req.session})
    },
    signup: async function(req,res){
        var User = require("../models/users");
        var dev;
        if(req.body.dev == "true"){
            var dev = true
        }else{
            var dev = false
        };
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = await req.validationErrors();
        if(errors){
            req.session.err = "Please do not leave forms empty!";
            res.redirect("/signup")
        }else{
            dbCreate.newUser({username:req.body.username, password:req.body.password, dev:dev, gravatar:req.file.filename}, function(err, saved){
                if(err){
                    req.session.err = "Please use a unique username";
                    res.redirect("/signup")
                }else{
                    res.redirect("/login")
                }
            })
        }
    },
    logout: function(req,res){
        req.session.destroy();
        res.redirect("/login")
    },
    any: function(req,res){
        res.render("404", {session:req.session})
    }
}