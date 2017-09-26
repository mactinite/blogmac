var express = require('express');
var hbs = require('hbs');
var moment = require('moment');
var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose');

var flash = require('connect-flash');

var favicon = require('serve-favicon');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieSession = require('cookie-session');

var hbsHelpers = require("./util/handlebars-helpers.js"); // Custom Handlebars Helpers

try {
  var config = require('./config/config.js');
} catch (ex) {
  console.log("No config file present");
  console.log(ex);
}


var validator = require('validator');

global.appRoot = path.resolve(__dirname);

mongoose.connect(process.env.DB_URL ||config.url);

//data models
require('./models/posts');
require('./models/users');
require('./models/user-roles');
require('./models/configuration');
require('./config/passport')(passport); 

//routes
var routes = require('./routes/routes.js')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'hbs');

//required for passport
app.use(cookieSession({
  name: 'session',
  secret : process.env.AUTH_SECRET || config.cookieSecret,
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//register helpers
hbsHelpers.registerHelpers();
hbs.registerPartials(__dirname + '/views/partials');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './../public')));

//use our routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = app_name;
  res.locals.sub_title = err.status;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
