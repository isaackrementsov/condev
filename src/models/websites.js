var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var websiteSchema = new Schema({
    name: {type: String},
    description: {type: String},
    keywords: [{name: String, value: Number, keyType: String}],
    author: {type: String},
    closed: {type:Boolean}
});
var Website = mongoose.model('Website', websiteSchema);
module.exports = Website;