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
    },
    home: async function(req,res){
        var user = await dbFind.findUser({'username':req.session.user});
        var websites = await dbFind.searchSites({});
        var jobs = await dbFind.searchJobs({});
        var langs = user.languages;
        var expJobs = [];
        var expWeb = [];
        //Find jobs by languages
        for(let i = 0; i < langs.length; i++){
            //Search array to find where name is the language searching for
            expJobs = expJobs.concat(jobs.filter(function(job){
                //Make sure job is not already part of array
                if(expJobs.indexOf(job) == -1){
                    return job.name.indexOf(langs[i].name) != -1
                }
            }));
        }
        //Find websites by job ids
        for(let i = 0; i < expJobs.length; i++){
            expWeb = expWeb.concat(websites.filter(function(website){
                if(expWeb.indexOf(website) == -1){
                    if(website._id == expJobs[i].websiteId){
                        website.matched = 1;
                        return website
                    }
                }else{
                    website.matched++;
                }
                website.relevance = Math.pow(website.matched, 1/7) 
            }))
        }
        res.render("dHome", {
            session:req.session, 
            websites:expWeb.sort(function (a, b){
                    return b.relevance - a.relevance
            }), 
            jobs:expJobs
        })
    }
}