var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jobSchema = new Schema({
    name: {type:String},
    websiteId: {type:String},
    payment: {type:Number},
    applicants: [{name:String, chosen:Boolean, createdAt: Date, chosenAt: Date}],
    closed: {type:Boolean},
    author: {type:String}
});
var Job = mongoose.model('Job', jobSchema);
module.exports = Job;