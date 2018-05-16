var mongoose = require('mongoose');
    bcrypt = require('bcrypt');
    salt_factor = 10;
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, unique:true},
    password: {type: String},
    dev: {type: Boolean},
    creditCardNumber: {type: Number},
    gravatar: {type: String},
    bio: {type:String},
    languages: [{name: String}],
    xp: {type:Number},
    createdAt: {type:Date}
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(salt_factor, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
}


var User = mongoose.model('User', userSchema);
module.exports = User;
