const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // ✅ Sửa lỗi cú pháp
opts.secretOrKey = process.env.JWT_SECRET;

// Cấu hình JWT Strategy
exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT Payload:", jwt_payload);

    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = function (req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        const error = new Error('You are not authenticated!');
        error.status = 401;
        return next(error);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    const error = new Error('No token provided!');
    error.status = 403;
    return next(error);
  }
};