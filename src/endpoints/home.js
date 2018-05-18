var dbFind = require('../core/dbFind');
var dbCreate = require('../core/dbCreate');
var dbUpdate = require('../core/dbUpdate');
module.exports = {
    renderLogin: function(req,res){
        res.render('login', {session:req.session})
    },
    login: async function(req,res){
        var user = await dbFind.find('User', {$or:[{'username':req.body.username.trim()}, {'email':req.body.username.trim()}], 'password':req.body.password.trim()});
        if(user){
            req.session.userId = user._id;
            req.session.dev = user.dev;
            req.session.user = user.username;
            if(user.dev){
                res.redirect('/devHome')
            }else{
                res.redirect('/clients/' + req.session.user)
            }
        }else{
            req.session.err = ['Incorrect credentials'];
            res.redirect('/login')
        }
    },
    renderSignup: function(req, res){
        res.render('signup', {session:req.session})
    },
    signup: function(req,res){
        var User = require('../models/users');
        var dev;
        if(req.body.dev == 'true'){
            var dev = true
        }else{
            var dev = false
        }
        if(!req.file){
            req.file = {};
            req.file.filename = '/static/profile.png'
        }
        dbCreate.create('User', {username:req.body.username.trim(), password:req.body.password.trim(), dev:dev, gravatar:req.file.filename, createdAt:Date.now(), xp:0}, function(err, saved){
            if(err){
                req.session.err = ['Please use a unique username'];
                res.redirect('/signup')
            }else{
                module.exports.login(req,res)
            }
        })
    },
    logout: function(req,res){
        req.session.destroy();
        res.redirect('/login')
    },
    update: function(req,res){
        if(req.params.attr == 'lang' && req.session.dev){
            dbUpdate.update('User', {'username':req.session.user}, {$push:{'languages':{'name':req.body.value}}})
        }else if(req.params.attr == 'bio'){
            dbUpdate.update('User', {'username':req.session.user}, {'bio':req.body.value})
        }else if(req.params.attr == 'gravatar'){
            if(req.file){
                dbUpdate.update('User', {'username':req.session.user}, {'gravatar':req.file.filename})
            }
        }
        var dev = req.session.dev ? 'devs' : 'clients';
        res.redirect('/' + dev + '/' + req.session.user)
    },
    any: function(req,res){
        res.render('404', {session:req.session})
    }
}