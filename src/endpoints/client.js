var dbFind = require("../core/dbFind");
module.exports = {    
    index: async function(req,res){
        if(!req.session.dev){
            //Wait for queries to execute
            var websites = await dbFind.searchSites({'author':req.params.username});
            var user = await dbFind.findUser({'username':req.params.username});
            if(user){
                //Safely import user document without password, credit card number, or ID
                var secureUser = {
                    username: user.username,
                    dev: user.dev,
                    gravatar: user.gravatar
                }
            }else{
                var secureUser = "User not found"
            }
            res.render("client", {docs:websites, user:secureUser, session:req.session})
        }else{
            res.redirect("/devs/" + req.session.user)
        }
    }
}