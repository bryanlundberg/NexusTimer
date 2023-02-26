const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const csrf = require("csurf");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("serve-favicon");

const indexRouter = require("./routes/index");
const profileRouter = require("./routes/profileRouter");
const timerRouter = require("./routes/timerRouter");
const apiRouter = require("./routes/apiRouter");
const submitRouter = require("./routes/submitRouter");
const authRouter = require("./routes/authRouter");
const logoutRouter = require("./routes/logoutRouter");

const { logError, errorHandler } = require("./middlewares/errorHandler")
const { startMongooseDB } = require("./mongo")

const app = express();

//sessions - express
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
  (user, done) =>
    done(null, {
      id: user._id,
      username: user.username,
    }) //se guardará en req.user
); //req.user se envia

passport.deserializeUser(async (user, done) => {
  return done(null, user); //se guardará en req.user
});


startMongooseDB().catch((err) => console.log(err));



//favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//csrf - - Habilita un token para los formularios garantizar que vienen de nuestra pagina.
app.use(csrf());
//csrf - - Aqui aplica el token de forma global automatico
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  req.user ? res.locals.loggedIn = true : res.locals.loggedIn = false; //checa si hay alguien iniciado sesion.
  req.user ? res.locals.userSession = req.user : '';
  next(); //pasa a lo siguiente dice
});

app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/timer", timerRouter);
app.use("/submit", submitRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/logout", logoutRouter)

app.use(logError);
app.use(errorHandler);

module.exports = app;
