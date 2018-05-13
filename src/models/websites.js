var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var websiteSchema = new Schema({
    name: {type: String},
    description: {type: String},
    keywords: [{name: String, value: Number, keyType: String}],
    author: {type: String},
    closed: {type:Boolean},
    done: {type:Boolean},
    members: [{name:String, job:String}],
    chats: [{message:String, author:String, madeAt: Date}],
    githubRepository: {type:String}
});
var Website = mongoose.model('Website', websiteSchema);
module.exports = Website;