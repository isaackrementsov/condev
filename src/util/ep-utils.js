var dbFind = require('../core/dbFind');
var ObjectId = require('mongodb').ObjectID;
//Middleware helpers for common router validation
module.exports = {
    //Check if the user is a developer
    checkDev: function(req, res, next){
        if(!req.session.userId){
            res.redirect('/login')
        }else if(!req.session.dev){
            res.redirect('/clients/' + req.session.user)
        }else{
            next()
        }
    },
    //Check if user is a client
    checkClient: function(req,res, next){
        if(!req.session.userId){
            res.redirect('/login')
        }else if(req.session.dev){
            res.redirect('/devs/' + req.session.user)
        }else{
            next()
        }
    },
    //Check if user is not logged in
    checkUser: function(req,res,next){
        if(req.session.userId){
            if(req.session.dev){
                res.redirect('/devs/' + req.session.user)
            }else{
                res.redirect('/clients/' + req.session.user)
            }
        }else{
            next()
        }
    },
    //Iterate through req.body to make sure nothing is empty and then redirect to desired url
    notEmpty: function(fields, redTo){
        return function(req,res,next){
            for(let i = 0; i < fields.length; i++){
                req.checkBody(fields[i], fields[i].toTitle() + ' is required').notEmpty();
            }
            var errors = req.validationErrors();
            if(errors){
                var errArr = [];
                for(var i = 0; i < errors.length; i++){
                    errArr.push(errors[i].msg)
                }
                req.session.err = errArr;
                if(redTo.indexOf(':') != -1){
                    var path = redTo.split(':')[1];
                    res.redirect(redTo.split(':')[0] + req.params[path])
                }else if(redTo.indexOf('!') != -1){
                    var path = redTo.split('!')[1];
                    var dev = req.session.dev ? 'devs' : 'clients';
                    res.redirect(redTo.split('!')[0] + dev + '/' +  req.session[path])
                }else{
                    res.redirect(redTo)
                }
            }else{
                next()
            }
        }
    },
    //Check if user is logged in
    checkIn: function(req,res,next){
        if(req.session.user){
            next()
        }else{
            res.redirect('/login');
        }
    }
}