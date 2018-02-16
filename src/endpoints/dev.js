module.exports = {
    index: async function(req,res){
        if(req.session.userId){
            if(req.session.dev){
                res.render("dev", {session:req.session})
            }else{
                res.redirect("/clients/" + req.session.user)
            }
        }else{
            res.redirect("/login")
        }
    }
}