var dbFind = require("../core/dbFind");
module.exports = {    
    index: async function(req,res){
        //Wait for queries to execute
        var websites = await dbFind.searchSites({'author':req.params.username});
        var websites = websites.reverse();
        var user = await dbFind.findUser({'username':req.params.username, dev:false});
        if(user){
            //Safely import user document without password, credit card number, or ID
            var secureUser = {
                username: user.username,
                dev: user.dev,
                gravatar: user.gravatar,
                bio: user.bio
            }
        }else{
            var secureUser = "User not found"
        }
        res.render("client", {websites:websites, user:secureUser, session:req.session})
    }
}