var dbCreate = require("../core/dbCreate");
var dbDelete = require("../core/dbDelete");
var dbUpdate = require("../core/dbUpdate");
var dbFind = require("../core/dbFind");
var ObjectId = require('mongodb').ObjectID;
module.exports = {
    create: function(req,res){
        var websiteId = ObjectId(req.params.websiteId);
        dbUpdate.updateSite({'_id':websiteId, 'author':req.session.user}, {$push:{'keywords':{'name':req.body.name, 'value':7, 'keyType':'job'}}}, {}, function(err, update){
            if(update.nModified != 0){
                dbCreate.newJob({name:req.body.name, payment:req.body.payment, websiteId:websiteId, author:req.session.user})
            }
        });
        res.redirect("/websites/" + req.params.websiteId) 
    },
    delete: function(req,res){
        var jobId = ObjectId(req.params.jobId);
        var websiteId = ObjectId(req.params.websiteId);
        var user = req.session.user;
        dbDelete.delJob({'_id':jobId, 'author':user});
        dbUpdate.updateSite({'_id':websiteId, 'author':user}, {$pull:{'keywords':{'name':req.params.name, 'keyType':'job'}}});
        res.redirect("/websites/" + req.params.websiteId) 
    },
    apply: async function(req,res){
        var jobId = ObjectId(req.params.jobId);
        //Make sure applicant is developer
        if(req.session.dev){
            //Add new applicant
            var job = await dbFind.findJob({'_id':jobId, 'applicants.name':req.session.user});
            //Make sure user is not already signed up for job
            if(job){
                req.session.err = ["You've already applied for this job!"]
                console.log(job.applicants[0].created_at)
            }else{
                //Add user as job applicant
                dbUpdate.updateJob({'_id':jobId}, {$push: {'applicants':{'name':req.session.user, createdAt: Date.now()}}})
            }
        }else{
            req.session.err = ["You're not a developer!"]
        }
        res.redirect("/websites/" + req.params.websiteId) 
    },
    delApp: function(req,res){
        var jobId = ObjectId(req.params.jobId);
        var userName = req.params.userName;
        dbUpdate.updateJob({'_id':jobId, 'author':req.session.user}, {$pull:{'applicants':{'name':userName}}});
        res.redirect("/websites/" + req.params.websiteId)
    },
    addApp: function(req,res){
        var jobId = ObjectId(req.params.jobId);
        var userName = req.params.userName;
        dbUpdate.updateJob({'_id':jobId, 'applicants.name':userName, 'author':req.session.user}, {$set:{'applicants.$.chosen':true, 'closed':true}});
        res.redirect("/websites/" + req.params.websiteId)
    }
}