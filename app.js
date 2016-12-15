var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var config = require('./config/config');

mongoose.connect(config.database);

var User = require('./models/user-model');

var app = express();

var index = require('./routes/index.js');
var api = require('./routes/api.js');

require('./config/passport.js')(app, passport)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', api);
app.use('*', index);

// This was left in this file due to some issues making authentication work with Router
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status('401').json(info); }

        var token = user.generateJWT();

        return res.json({
            "user": user.username,
            "token": token
        })

    })(req, res, next);
});

var Burns = new User({

    username: 'tbaccardi',
    password: 'Password()'

})

User.findOne({username: Burns.username}, function(err, user) {
    if(!user) {
        Burns.save(function(err) {
            if(err) throw err;

            console.log('new user added');
        })
    }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
