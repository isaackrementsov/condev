var Website = require('../models/websites');
var User = require('../models/users');
var Job = require('../models/jobs');
var fs = require('fs');
var newUser = function(data, callback){
    User.create(data, function(err, saved){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err, saved)
        }
    })
}
var newWebsite = function(data, callback){
    Website.create(data, function(err,saved){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,saved)
        }
    })
}
var newJob = function(data, callback){
    Job.create(data, function(err,saved){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,saved)
        }
    })
}
module.exports = {
    newUser: newUser,
    newWebsite: newWebsite,
    newJob: newJob
}