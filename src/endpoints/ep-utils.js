module.exports = {
    checkDev: function(req, res, next){
        if(!req.session.userId){
            res.redirect("/login")
        }else if(!req.session.dev){
            res.redirect("/clients/" + req.session.user)
        }else{
            next()
        }
    },
    checkClient: function(req,res, next){
        if(!req.session.userId){
            res.redirect("/login")
        }else if(req.session.dev){
            res.redirect("/devs/" + req.session.user)
        }else{
            next()
        }
    },
    checkUser: function(req,res,next){
        if(req.session.userId){
            if(req.session.dev){
                res.redirect("/devs/" + req.session.user)
            }else{
                res.redirect("/clients/" + req.session.user)
            }
        }else{
            next()
        }
    }
}