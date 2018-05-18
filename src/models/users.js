var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {type: String, unique:true},
    password: {type: String},
    dev: {type: Boolean},
    creditCardNumber: {type: Number},
    gravatar: {type: String},
    bio: {type:String},
    languages: [{name: String}],
    xp: {type:Number},
    createdAt: {type:Date},
    email:{type:String}    
});
var User = mongoose.model('User', userSchema);
module.exports = User;