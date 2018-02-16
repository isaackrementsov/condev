var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var userSchema = new Schema({
    username: {type: String, unique:true},
    password: {type: String},
    dev: {type: Boolean},
    creditCardNumber: {type: Number},
    gravatar: {type: String}    
});
var User = mongoose.model("User", userSchema);
module.exports = User;