var Website = require('../models/websites');
var User = require('../models/users');
var Job = require('../models/jobs');
var fs = require('fs');
var delUser = function(data, callback){
    User.remove(data, function(err){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err)
        }
    })
}
var delWebsite = function(data, callback){
    Website.remove(data, function(err){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err)
        }
    })
}
var delJob = function(data, callback){
    Job.remove(data, function(err){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err)
        }
    })
}
module.exports = {
    delUser: delUser,
    delWebsite: delWebsite,
    delJob: delJob
}