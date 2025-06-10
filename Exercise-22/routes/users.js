const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const User = require('../models/user');

// 🔐 Login endpoint
userRouter.get('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: 'Login successfully', user: req.user });
});

// 📝 Signup endpoint
userRouter.post('/signup', (req, res, next) => {
  console.log(req.body.username);
  console.log(req.body.password);

  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.json({ err: err });
      }

      // Tự động login sau khi đăng ký thành công
      passport.authenticate('local', { session: true })(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'Registration Successful!' });
      });
    }
  );
});
// 🚪 Logout endpoint
userRouter.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }

    // Hủy session và xóa cookie
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.send('Logged out');
    });
  });
});

module.exports = userRouter;

