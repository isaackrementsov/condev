var Website = require('../models/websites');
var User = require('../models/users');
var Job = require('../models/jobs');
var fs = require('fs');
var models = {
    User: User,
    Website: Website,
    Job: Job
}
var find = function(model, data, select, callback){
    return models[model].findOne(data, select, function(err, docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
var search = function(model, data, select, callback){
    return models[model].find(data, select, function(err, docs){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,docs)
        }
    })
}
module.exports = {
    search:search,
    find:find
}