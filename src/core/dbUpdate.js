var User = require('../models/users');
var Website = require('../models/websites');
var Job = require('../models/jobs');
var fs = require('fs');
var models = {
    User: User,
    Website: Website,
    Job: Job
}
var update = function(model, data, update, conditions, callback){
    models[model].update(data, update, conditions, function(err, changed){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,changed)
        }
    })
}
var findOneAndUpdate = function(model, data, update, conditions, callback){
    models[model].findOneAndUpdate(data, update, conditions, function(err, changed){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,changed)
        }
    })
}
module.exports = {
    update: update,
    findOneAndUpdate: findOneAndUpdate
}