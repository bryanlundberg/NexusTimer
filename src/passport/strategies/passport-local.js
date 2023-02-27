const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy
const User = require("../../models/User")

passport.serializeUser((user, done) => {
  done(null, user._id)
});

passport.deserializeUser( async (id, done) => {
	const user = await User.findById(id)
  done(null, user);
});

const localStrategy = new LocalStrategy(async function (username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false);
    }
    if (!user.comparePassword(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});


module.exports = localStrategy