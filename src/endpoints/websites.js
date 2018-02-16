var illegalWords = ["it", "in", "is", "a", "the", "for", "with", " ", "an", "", "this", "that", ".", ","];
var fs = require("fs");
var dbUpdate = require("../core/dbUpdate");
var dbFind = require("../core/dbFind");
var dbDelete = require("../core/dbDelete");
var dbCreate = require("../core/dbCreate");
var ObjectId = require('mongodb').ObjectID;
module.exports = {
    index: function(req,res){
        if(req.session.userId){
            if(!req.session.dev){
                res.render("websites", {session:req.session})
            }else{
                res.redirect("/devs/" + req.session.user)
            }
        }else{
            res.redirect("/login")
        }
    },
    create: function(req,res){
        var array = [];
        for(var i = 0; i < req.body.words.split(",").length; i++ ){
                array.push({name:req.body.words.split(",")[i], value:2, keyType:"keyword"});
        }
        for(var i = 0; i < req.body.description.split(" ").length; i++ ){
            if(illegalWords.indexOf(req.body.description.split(" ")[i].toLowerCase()) == -1){
                array.push({name:req.body.description.split(" ")[i], value:1, keyType:"description"});
            }
        }
        array.push({name:req.body.website, value:5, keyType:"name"});
        array.push({name:req.session.user, value:6, keyType:"author"});
        var jobData = req.body.jobData.split("]");
        var jobs = [];
        req.checkBody('description', 'Description is required').notEmpty();
        req.checkBody('website', 'Website is required').notEmpty();
        req.checkBody('words', 'Words are required').notEmpty();
        var errors = req.validationErrors();
        if(!errors){
            dbCreate.newWebsite({name:req.body.website, keywords:array, author:req.session.user, description:req.body.description}, function(err,saved){
                var siteId = ObjectId(saved._id);
                for(var i = 0; i < (jobData.length - 1); i++){
                    var name = jobData[i].split(",")[0];
                    var payment = parseFloat(jobData[i].split(",")[1]);
                    jobs.push({name:name, payment:payment, websiteId:siteId})
                }
                dbCreate.newJob(jobs)
            });
            res.redirect("/clients/" + req.session.user)
        }else{
            req.session.err = "Please do not leave forms empty!";
            res.redirect("/client/websites")
        }
    },
    show: async function(req,res){
        var id = ObjectId(req.params.websiteId);
        var website = await dbFind.findSite({'_id':id});
        var jobs = await dbFind.searchJobs({'websiteId':id});
        res.render("showWebsite", {doc:website, jobs:jobs, session:req.session})
    },
    update: async function(req,res){
            var id = ObjectId(req.params.websiteId);
            var formValue = req.body.value;
            var attr = req.params.attr;
            var val;
            if(formValue){
                if(attr == "name"){
                    //Set keyword value corresponding to update attribute
                    val = 5;
                    //Remove old title with core module update API
                    dbUpdate.updateSite({'_id':id}, {$pull:{'keywords':{'keyType':attr}}});
                    //Add new website title
                    dbUpdate.updateSite({'_id':id}, {$push:{'keywords':{'value':val, 'name':formValue, 'keyType':attr}}});
                    dbUpdate.updateSite({_id:id}, {'name':formValue})
                }else if(attr = "description"){
                    val = 1;
                    var description = formValue.split(" ");
                    var desc = [];
                    for(var i = 0; i < description.length; i++){
                        desc.push({name: description[i], keyType: attr, value: val})
                    }
                    //Remove all old description keywords
                    dbUpdate.updateSite({'_id':id}, {$pull:{'keywords':{'value':val}}});
                    //Add new description keywords
                    dbUpdate.updateSite({'_id':id}, {$push:{'keywords':{$each:desc}}});
                    dbUpdate.updateSite({'_id':id}, {'description':formValue})
                }
            //These parts of the update method now deal with a separate database collection and thus will be moved to their own controller.
            }else if(attr.split("+")[0] == "jobs"){
                //Remove job
                var jobId = ObjectId(attr.split("+")[1]);
                dbDelete.delJob({'_id':jobId})
            }else if(attr.split("+")[0] == "applicant"){
                var jobId = ObjectId(attr.split("+")[1]);
                //Make sure applicant is developer
                if(req.session.dev){
                    //Add new applicant
                    var job = await dbFind.findJob({'_id':jobId, 'applicants.name':req.session.user});
                    //Make sure user is not already signed up for job
                    if(job){
                        req.session.err = "You've already applied for this job!"
                    }else{
                        //Add user as job applicant
                        dbUpdate.updateJob({'_id':jobId}, {$push: {'applicants':{'name':req.session.user}}})
                    }
                }else{
                    req.session.err = "You're not a developer!"
                }
            }else if(attr == "newJob"){
                //Add a job
                dbCreate.newJob({name:req.body.name, payment:req.body.payment, websiteId:id})
            }
            res.redirect("/websites/" + req.params.websiteId)      
    },
    delete: function(req,res){
        var id = ObjectId(req.params.websiteId);
        dbDelete.delWebsite({'_id':id});
        dbDelete.delJob({'websiteId':id});
        res.redirect("/clients/" + req.session.user)
    }
}