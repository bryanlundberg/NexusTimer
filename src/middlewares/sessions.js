require("dotenv").config()
const session = require("express-session");
const MongoStore = require("connect-mongo");

const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DB = process.env.DB
const sName = process.env.NAME
const sSecret = process.env.SECRET

const sessionsExpress = session({
  secret: sSecret,
  resave: false,
  saveUninitialized: false,
  name: sName,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${USER}:${PASSWORD}@cluster0.dltd4ag.mongodb.net/${DB}?retryWrites=true&w=majority`,
  }),
});

module.exports = { sessionsExpress };