var Website = require('../models/websites');
var User = require('../models/users');
var Job = require('../models/jobs');
var fs = require('fs');
var findUser = function (data, select, callback){
    return User.findOne(data, select, function(err,docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
var findSite = function(data, select, callback){
    return Website.findOne(data, select, function(err,docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
var findJob = function(data, select, callback){
    return Job.findOne(data, select, function(err,docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
var searchSites = function(data, select, callback){
    return Website.find(data, select, function(err,docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    });
}
var searchUsers = function(data, select, callback){
    return User.find(data, select, function(err,docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
searchJobs = function(data, select, callback){
    return Job.find(data, select, function(err,docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
module.exports = {
    searchSites: searchSites,
    searchUsers: searchUsers,
    findJob: findJob,
    searchJobs: searchJobs,
    findSite: findSite,
    findUser: findUser
}