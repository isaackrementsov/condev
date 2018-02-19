var dbFind = require("../core/dbFind");
module.exports = {
    index: async function(req,res){
        //Wait for queries to execute
        var user = await dbFind.findUser({'username':req.params.username, dev:true});
        var jobs = await dbFind.searchJobs({'applicants.name':req.params.username});
        var jobs = jobs.reverse();
        if(user){
            //Safely import user document without password or credit card number
            var secureUser = {
                username: user.username,
                dev: user.dev,
                gravatar: user.gravatar,
                _id: user._id,
                bio: user.bio,
                languages: user.languages
            }
        }else{
            var secureUser = "User not found"
        }
        res.render("dev", {session:req.session, user:secureUser, jobs:jobs})
    }
}