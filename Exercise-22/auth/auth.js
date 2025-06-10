const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Cấu hình chiến lược local
passport.use(new LocalStrategy(User.authenticate()));

// Cấu hình serialize và deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});
