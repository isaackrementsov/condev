var dbFind = require('../core/dbFind');
//Relevance algorithm: full explanation will be on this site: isaackrementsovnexus.weebly.com
//Will return a relevance based on a document's client XP, client sign up date and matched languages
var getRelevance = function(doc){
    var matches = Math.pow(doc.matched, 1/3);
    var xp = doc.points ?  -25 * Math.pow(0.98426, doc.points) + 25 : 10 * Math.pow(0.75, doc.createdAt/86400);
    var increase = matches*(xp/100);
    var relevance = increase ? matches + increase : matches
    return relevance
}
module.exports = {
    index: async function(req,res){
        //Wait for queries to execute
        //Make sure that no sensitive user information is imported (such as passwords, credit card numbers)
        var user = await dbFind.find('User', {'username':req.params.username, dev:true}, {'password':false, 'creditCardNumber':false, '_id':false});
        var jobs = await dbFind.search('Job', {'applicants.name':req.params.username});
        //Sort jobs by date
        jobs = jobs.sort(function(a,b){
            return b.applicants[b.applicants.map(function(app){return app.name}).indexOf(user.username)].createdAt - a.applicants[a.applicants.map(function(app){return app.name}).indexOf(user.username)].createdAt
            //console.log(a.applicants.indexOf(user.username))
        });
        res.render('dev', {session:req.session, user:user, jobs:jobs})
    },
    home: async function(req,res){
        //This controller uses algorithms to search the database for recommended jobs
        var user = await dbFind.find('User', {'username':req.session.user});
        var websites = await dbFind.search('Website', {});
        var jobs = await dbFind.search('Job', {});
        var clients = await dbFind.search('User', {});
        var langs = user.languages;
        var expJobs = [];
        var expWeb = [];
        //Find jobs by languages
        for(let i = 0; i < langs.length; i++){
            //Search array to find where name is the language searching for
            expJobs = expJobs.concat(jobs.filter(function(job){
                //Make sure job is not already part of array
                if(expJobs.indexOf(job) == -1 && !job.closed){
                    return (job.name.toLowerCase().indexOf(langs[i].name.fix()) != -1) && (job.applicants.map(function(a){return a.name}).indexOf(req.session.user) == -1)
                }
            }));
        }
        //Find websites by job ids
        for(let i = 0; i < expJobs.length; i++){
            expWeb = expWeb.concat(websites.filter(function(website){
                //Set fields to 0, so that they will not return undefined or NaN
                if(!website.matched) website.matched = 0;
                if(!website.relevance) website.relevance = 0;
                if(!website.points) website.points = 0;
                //Check if website id matches job ids
                if(website._id == expJobs[i].websiteId){
                    //Check if website is already in the list
                    if(expWeb.indexOf(website) == -1){
                        //Find the client who made the website
                        var client = clients.find(function(client){return client.username == website.author});
                        website.matched++;
                        website.points += client.xp;
                        website.createdAt = client.createdAt;
                        website.relevance = getRelevance(website);
                        website.jobs = [];
                        website.jobs.push(expJobs[i].name);
                        return website
                    }else{
                        website.matched++;
                        website.relevance = getRelevance(website);
                        website.jobs.push(expJobs[i].name)
                    }
                } 
            }))
        }
        res.render('dHome', {
            session:req.session, 
            websites:expWeb.sort(function (a, b){
                    return b.relevance - a.relevance
            })
        })
    }
}