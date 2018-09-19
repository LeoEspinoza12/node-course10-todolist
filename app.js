var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('express-handlebars')

const session = require('express-session')
const FileStore = require('session-file-store')(session)



// here we will add the passport
const passport = require('passport');
const authenticate = require('./authenticate')

const config = require('./config')


var listsRouter = require('./routes/lists');
var usersRouter = require('./routes/users');


// here we will add the config file for our database
const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser: true})
connect.then((db) => {
  console.log('connected correctly to the server \n');
}, (err) => {
  console.log(err)
});


var app = express();


const {generateTime,alertThis} = require('./helpers/handlebars-helpers')

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'list', layoutsDir: __dirname + '/views/layouts/', helpers: { generateTime: generateTime, alertThis: alertThis }
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));




// we will use the passport to 
// initialize the session
app.use(passport.initialize());

// we will place this route before the authentication
// since we want this route available without authentication
app.use('/', usersRouter);



// this route will be now be available in the event that the 
// authentication is verified
app.use('/lists', listsRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   console.log('There was an error')
//   // next(createError(404));
// });

// this is basically a customed middleware that is called for every 
// request and this will pass an error if there is any
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
