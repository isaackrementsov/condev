module.exports = {
    checkUser: function(req, res){
        if(req.session.userId){
            res.redirect(params.redirect)
        }else if(!status){
            res.redirect(params.redirect2)
        }
    }
}