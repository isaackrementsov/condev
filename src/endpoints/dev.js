var dbFind = require("../core/dbFind");
var getRelevance = function(doc){
    var matches = Math.pow(doc.matched, 1/3);
    var xp = -25 * Math.pow(0.98426, doc.points) + 25;
    var increase = doc.relevance*(xp/100);
    var relevance = increase ? matches + increase : matches
    return relevance
}
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
        var clients = await dbFind.searchUsers({});
        var langs = user.languages;
        var expJobs = [];
        var expWeb = [];
        //Find jobs by languages
        for(let i = 0; i < langs.length; i++){
            //Search array to find where name is the language searching for
            expJobs = expJobs.concat(jobs.filter(function(job){
                //Make sure job is not already part of array
                if(expJobs.indexOf(job) == -1 && !job.closed){
                    return job.name.toLowerCase().indexOf(langs[i].name.fix()) != -1
                }
            }));
        }
        //Find websites by job ids
        for(let i = 0; i < expJobs.length; i++){
            expWeb = expWeb.concat(websites.filter(function(website){
                if(!website.matched) website.matched = 0;
                if(!website.relevance) website.relevance = 0;
                if(!website.points) website.points = 0;
                if(expWeb.indexOf(website) == -1){
                    if(website._id == expJobs[i].websiteId){
                        var client = clients.find(function(client){return client.username == website.author});
                        website.matched++;
                        website.points += client.xp;
                        website.relevance = getRelevance(website);
                        return website
                    }
                }else{
                    website.matched++;
                    website.relevance = getRelevance(website)
                }
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