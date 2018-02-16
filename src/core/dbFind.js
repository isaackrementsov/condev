var Website = require("../models/websites");
var User = require("../models/users");
var Job = require("../models/jobs");
var findUser = function (data, callback){
    return User.findOne(data, function(err,docs){
        if(callback){
            callback(err,docs)
        }
    })
}
var findSite = function(data, callback){
    return Website.findOne(data, function(err,docs){
        if(callback){
            callback(err,docs)
        }
    })
}
var findJob = function(data, callback){
    return Job.findOne(data, function(err,docs){
        if(callback){
            callback(err,docs)
        }
    })
}
var searchSites = function(data, callback){
    return Website.find(data, function(err,docs){
        if(callback){
            callback(err,docs)
        }
    });
}
var searchUsers = function(data, callback){
    return User.find(data, function(err,docs){
        if(callback){
            callback(err,docs)
        }
    })
}
searchJobs = function(data, callback){
    return Job.find(data, function(err,docs){
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