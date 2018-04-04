var User = require('../models/users');
var Website = require('../models/websites');
var Job = require('../models/jobs');
var fs = require('fs');
var updateSite = function(data, update, conditions, callback){
    Website.update(data, update, conditions, function(err,changed){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,changed)
        }
    })    
}
var updateUser = function(data, update, conditions, callback){
    User.update(data, update, conditions, function(err,changed){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,changed)
        }
    })
}
var updateJob = function(data, update, conditions, callback){
    Job.update(data, update, conditions, function(err,changed){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,changed)
        }
    })
}
module.exports = {
    updateUser: updateUser,
    updateSite: updateSite,
    updateJob: updateJob
}