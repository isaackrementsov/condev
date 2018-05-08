var illegalWords = ['it', 'in', 'is', 'a', 'the', 'for', 'with', ' ', 'an', '', 'this', 'that', '.', ','];
var fs = require('fs');
var dbUpdate = require('../core/dbUpdate');
var dbFind = require('../core/dbFind');
var dbDelete = require('../core/dbDelete');
var dbCreate = require('../core/dbCreate');
var ObjectId = require('mongodb').ObjectID;
module.exports = {
    index: function(req,res){
        res.render('websites', {session:req.session})
    },
    create: function(req,res){
        var array = [];
        var keywords = req.body.words.split(',').map(function(word){return {name:word, value:2, keyType:'keyword'}});
        var description = req.body.description.split(' ').filter(function(word){return illegalWords.indexOf(word) === -1}).map(function(word){return {name:word, value:1, keyType:'description'}});
        var jobs = JSON.parse(req.body.jobData).map(function(job){return {name:job.name, payment:parseInt(job.payment)}});
        keywords = keywords.concat.apply(keywords, [description, jobs]);
        keywords.push({name:req.body.website, value:5, keyType:'name'});
        keywords.push({name:req.session.user, value:6, keyType:'author'});
        dbCreate.create('Website', {name:req.body.website, keywords:keywords, author:req.session.user, description:req.body.description}, function(err,saved){
            var siteId = ObjectId(saved._id);
            var jobsArr = jobs.map(function(job){return {name:job.name, payment: job.payment, websiteId:siteId, author:req.session.user}});
            dbCreate.newJob(jobsArr)
        });
        res.redirect('/clients/' + req.session.user)
    },
    show: async function(req,res){
        var id = ObjectId(req.params.websiteId);
        var website = await dbFind.find('Website', {'_id':id});
        var jobs = await dbFind.searchJobs('Job', {'websiteId':id});
        res.render('showWebsite', {doc:website, jobs:jobs, session:req.session})
    },
    update: async function(req,res){
            var id = ObjectId(req.params.websiteId);
            var formValue = req.body.value;
            var attr = req.params.attr;
            var user = req.session.user;
            if(formValue){
                var name;
                if(attr == 'name'){
                    name = [{keyType: attr, name: formValue, value: 5}]
                }else if(attr = 'description'){
                    name = formValue.split(' ').filter(function(word){return illegalWords.indexOf(word) === -1}).map(function(word){return {name:word, keyType:attr, value:1}});
                }
                dbUpdate.update('Website', {'_id':id, 'author':user}, {$pull:{'keywords':{'keyType':attr}}});
                dbUpdate.update('Website', {'_id':id, 'author':user}, {attr:formValue, $push:{'keywords':{$each:name}}})
            }
            res.redirect('/websites/' + req.params.websiteId)      
    },
    delete: function(req,res){
        var id = ObjectId(req.params.websiteId);
        var user = req.session.user;
        dbDelete.del('Website', {'_id':id, 'author':user});
        dbDelete.del('Job', {'websiteId':id});
        res.redirect('/clients/' + user)
    },
    close: function(req,res){
        var websiteId = ObjectId(req.params.websiteId);
        var user = req.session.user;
        dbUpdate.update('Site', {'_id':websiteId, 'author':user}, {'closed':true});
        dbUpdate.update('Job', {'websiteId':websiteId}, {'closed':true}, {multi:true});
        res.redirect('/websites/' + req.params.websiteId)
    }
}