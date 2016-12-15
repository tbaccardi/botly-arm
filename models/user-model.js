var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    jwt = require('jsonwebtoken');

var User = new Schema({
    
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true } 
    
});

User.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
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

User.methods.verifyPassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
    
};

User.methods.generateJWT = function() {
    var expire = new Date();
    expire.setDate(expire.getDate() + 7);
    
    return jwt.sign({
        _id: this._id,
        name: this.name,
        exp: parseInt(expire.getTime() / 1000)
    }, 'supertopsecret');  // Need to set this to environment variable at some point
}
    
module.exports = mongoose.model('User', User);