var illegalWords = ["it", "in", "is", "a", "the", "for", "with", " ", "an", "", "this", "that", ".", ","];
var fs = require("fs");
var dbUpdate = require("../core/dbUpdate");
var dbFind = require("../core/dbFind");
var dbDelete = require("../core/dbDelete");
var dbCreate = require("../core/dbCreate");
var ObjectId = require('mongodb').ObjectID;
module.exports = {
    index: function(req,res){
        res.render("websites", {session:req.session})
    },
    create: function(req,res){
        var array = [];
        var jobData = req.body.jobData.split("]");
        var jobs = [];
        for(var i = 0; i < req.body.words.split(",").length; i++ ){
                array.push({name:req.body.words.split(",")[i], value:2, keyType:"keyword"});
        }
        for(var i = 0; i < req.body.description.split(" ").length; i++ ){
            if(illegalWords.indexOf(req.body.description.split(" ")[i].toLowerCase()) == -1){
                array.push({name:req.body.description.split(" ")[i], value:1, keyType:"description"});
            }
        }
        for(var i = 0; i < (jobData.length - 1); i++){
            var name = jobData[i].split(",")[0];
            var payment = parseFloat(jobData[i].split(",")[1]);
            array.push({name:name, value:7, keyType: "job"})
        }
        array.push({name:req.body.website, value:5, keyType:"name"});
        array.push({name:req.session.user, value:6, keyType:"author"});
        dbCreate.newWebsite({name:req.body.website, keywords:array, author:req.session.user, description:req.body.description}, function(err,saved){
            var siteId = ObjectId(saved._id);
            for(var i = 0; i < (jobData.length - 1); i++){
                var name = jobData[i].split(",")[0];
                var payment = parseFloat(jobData[i].split(",")[1]);
                jobs.push({name:name, payment:payment, websiteId:siteId, author:req.session.user})
            }
            dbCreate.newJob(jobs)
        });
        res.redirect("/clients/" + req.session.user)
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
            var user = req.session.user;
            if(formValue){
                if(attr == "name"){
                    //Set keyword value corresponding to update attribute
                    val = 5;
                    //Remove old title with core module update API
                    dbUpdate.updateSite({'_id':id, 'author':user}, {$pull:{'keywords':{'keyType':attr}}});
                    //Add new website title
                    dbUpdate.updateSite({'_id':id, 'author':user}, {$push:{'keywords':{'value':val, 'name':formValue, 'keyType':attr}}});
                    dbUpdate.updateSite({_id:id}, {'name':formValue})
                }else if(attr = "description"){
                    val = 1;
                    var description = formValue.split(" ");
                    var desc = [];
                    for(var i = 0; i < description.length; i++){
                        desc.push({name: description[i], keyType: attr, value: val})
                    }
                    //Remove all old description keywords
                    dbUpdate.updateSite({'_id':id, 'author':user}, {$pull:{'keywords':{'value':val}}});
                    //Add new description keywords
                    dbUpdate.updateSite({'_id':id, 'author':user}, {$push:{'keywords':{$each:desc}}});
                    dbUpdate.updateSite({'_id':id, 'author':user}, {'description':formValue})
                }
            }
            res.redirect("/websites/" + req.params.websiteId)      
    },
    delete: function(req,res){
        var id = ObjectId(req.params.websiteId);
        var user = req.session.user;
        dbDelete.delWebsite({'_id':id, 'author':user});
        dbDelete.delJob({'websiteId':id});
        res.redirect("/clients/" + user)
    },
    close: function(req,res){
        var websiteId = ObjectId(req.params.websiteId);
        var user = req.session.user;
        dbUpdate.updateSite({'_id':websiteId, 'author':user}, {'closed':true});
        dbUpdate.updateJob({'websiteId':websiteId}, {'closed':true}, {multi:true});
        res.redirect('/websites/' + req.params.websiteId)
    }
}