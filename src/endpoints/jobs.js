var dbCreate = require('../core/dbCreate');
var dbDelete = require('../core/dbDelete');
var dbUpdate = require('../core/dbUpdate');
var dbFind = require('../core/dbFind');
module.exports = {
    create: function(req,res){
        var websiteId = req.params.websiteId;
        dbUpdate.update('Website', {'_id':websiteId, 'author':req.session.user}, {$push:{'keywords':{'name':req.body.name, 'value':7, 'keyType':'job'}}}, {}, function(err, update){
            if(update.nModified != 0){
                dbCreate.create('Job', {name:req.body.name, payment:req.body.payment, websiteId:websiteId, author:req.session.user})
            }
        });
        res.redirect('/websites/' + websiteId) 
    },
    delete: function(req,res){
        var jobId = req.params.jobId;
        var websiteId = req.params.websiteId;
        var user = req.session.user;
        dbDelete.del('Job', {'_id':jobId, 'author':user});
        dbUpdate.update('Website', {'_id':websiteId, 'author':user}, {$pull:{'keywords':{'name':req.params.name, 'keyType':'job'}}});
        res.redirect('/websites/' + websiteId) 
    },
    apply: async function(req,res){
        var jobId = req.params.jobId;
        //Make sure applicant is developer
        if(req.session.dev){
            //Add new applicant
            var job = await dbFind.find('Job', {'_id':jobId});
            var app = job.applicants.filter(function(app){
                return app.name == req.session.user
            })
            //Make sure user is not already signed up for job
            if(app.length){
                req.session.err = ["You've already applied for this job!"]
            }else if(!job.closed){
                //Add user as job applicant
                dbUpdate.update('Job', {'_id':jobId}, {$push: {'applicants':{'name':req.session.user, createdAt: Date.now()}}})
            }
        }else{
            req.session.err = ["You're not a developer!"]
        }
        res.redirect('/websites/' + req.params.websiteId)
    },
    delApp: function(req,res){
        var jobId = req.params.jobId;
        var userName = req.params.userName;
        dbUpdate.update('Job', {'_id':jobId, 'author':req.session.user}, {$pull:{'applicants':{'name':userName}}});
        res.redirect('/websites/' + req.params.websiteId)
    },
    addApp: function(req,res){
        var jobId = req.params.jobId;
        var websiteId = req.params.websiteId;
        var userName = req.params.userName;
        dbUpdate.findOneAndUpdate('Job', {'_id':jobId, 'applicants.name':userName, 'author':req.session.user}, {'applicants.$.chosen':true, 'applicants.$.chosenAt':Date.now(), 'closed':true}, {}, function(err, doc){
            if(doc){
                dbUpdate.update('Website', {'_id':websiteId}, {$push:{'members':{'name':userName, 'job':doc.name}}});
                dbUpdate.update('User', {'username':userName}, {$inc:{'xp':2}});
            }
        });
        res.redirect('/websites/' + websiteId)
    }
}