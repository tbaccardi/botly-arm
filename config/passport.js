var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user-model');

module.exports = function(app, passport) {
    
    app.use(passport.initialize());
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password))
        { return done(null, false); }
        return done(null, user);
        });
    }
    ));
    
}