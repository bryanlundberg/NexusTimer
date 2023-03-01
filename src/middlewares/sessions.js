const session = require("express-session");
const MongoStore = require('connect-mongo');

const USER = "usernametest"
const PASSWORD = "passwordtest"
const DB = "cubestats"

const sessionsExpress = session({
  secret: "sessionSecreta",
  resave: false,
  saveUninitialized: false,
  name: "secreto-nombre-session",
  store: MongoStore.create({
    mongoUrl:
      `mongodb+srv://${USER}:${PASSWORD}@cluster0.dltd4ag.mongodb.net/${DB}?retryWrites=true&w=majority`,
  }),
});

module.exports = { sessionsExpress }