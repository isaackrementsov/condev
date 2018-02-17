module.exports = {
    index: async function(req,res){
        res.render("dev", {session:req.session})
        res.redirect("/clients/" + req.session.user)
    }
}