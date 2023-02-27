const session = require("express-session");

const sessionsExpress =
	  session({
    secret: "sessionSecreta",
    resave: true,
    saveUninitialized: true,
    name: "secreto-nombre-session",
  })

module.exports = { sessionsExpress }