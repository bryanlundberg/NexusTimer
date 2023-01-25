const createError = require('http-errors');
const express = require('express');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');


const indexRouter = require('./routes/index');

const app = express();

//sessions
app.use(
    session({
        secret: "sessionSecreta",
        resave: false,
        saveUninitialized: false,
        name: "secreto-nombre-session",
    })
);

//flash
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(
    (user, done) => done(null, { id: user._id, username: user.username }) //se guardará en req.user
);//req.user se envia

passport.deserializeUser(async (user, done) => {
    return done(null, user); //se guardará en req.user
});

// Set up mongoose connection
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://usernametest:passwordtest@cluster0.dltd4ag.mongodb.net/projectWithUsers?retryWrites=true&w=majority');
}

//favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
