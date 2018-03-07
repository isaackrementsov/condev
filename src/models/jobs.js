var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var jobSchema = new Schema({
    name: {type:String},
    websiteId: {type:String},
    payment: {type:Number},
    applicants: [{name:String, chosen:Boolean, createdAt: Date, chosenAt: Date}],
    closed: {type:Boolean},
    done: {type:Boolean}
});
var Job = mongoose.model("Job", jobSchema);
module.exports = Job;