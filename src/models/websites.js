var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var websiteSchema = new Schema({
    name: {type: String},
    description: {type: String},
    keywords: [{name: String, value: Number, keyType: String}],
    author: {type: String}
});
var Website = mongoose.model("Website", websiteSchema);
module.exports = Website;