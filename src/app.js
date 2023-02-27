const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const csrf = require("csurf");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { loadFavicon } = require("./middlewares/favicon")
const { sessionsExpress } = require("./middlewares/sessions")
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

//express-sessions
app.use(sessionsExpress);

//flash - alerts
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

require("./passport/index.js")

//db
startMongooseDB().catch((err) => console.log(err));

//favicon
app.use(loadFavicon);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// variables
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  req.user ? res.locals.loggedIn = true : res.locals.loggedIn = false;
  req.user ? res.locals.userSession = req.user : '';
  next();
});

//routes
app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/timer", timerRouter);
app.use("/submit", submitRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/logout", logoutRouter)

//errors
app.use(logError);
app.use(errorHandler);

module.exports = app;
