const passport = require('passport')
const localStrategy = require('./strategies/passport-local')

passport.use(localStrategy)