var Website = require('../models/websites');
var User = require('../models/users');
var Job = require('../models/jobs');
var fs = require('fs');
var models = {
    User: User,
    Website: Website,
    Job: Job
}
var create = function(model, data, callback){
    models[model].create(data, function(err, saved){
        if(err){
            fs.writeFile('../../logs/db.json', err, function(err){})
        }
        if(callback){
            callback(err,saved)
        }
    })
}
module.exports = {
    create:create
}