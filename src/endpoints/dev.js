var dbFind = require("../core/dbFind");
module.exports = {
    index: async function(req,res){
        //Wait for queries to execute
        //Make sure that no sensitive user information is imported (such as passwords, credit card numbers)
        var user = await dbFind.findUser({'username':req.params.username, dev:true}, {'password':false, 'creditCardNumber':false, '_id':false});
        var jobs = await dbFind.searchJobs({'applicants.name':req.params.username});
        //Sort jobs by date
        jobs = jobs.reverse();
        res.render("dev", {session:req.session, user:user, jobs:jobs})
    }
}