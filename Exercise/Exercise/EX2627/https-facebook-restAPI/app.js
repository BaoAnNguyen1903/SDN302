const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');

const articlesRouter = require('./routes/articles');

const app = express();

// Thay YOUR_FACEBOOK_APP_ID và YOUR_FACEBOOK_APP_SECRET bằng thông tin thật của bạn
passport.use(new FacebookStrategy({
    clientID: '628027356958098',
    clientSecret: 'd04b2dfa706bac029adfe86c49f78325',
    callbackURL: 'https://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    // Ở đây bạn có thể lưu thông tin user vào DB nếu muốn
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<a href="/auth/facebook">Đăng nhập bằng Facebook</a>');
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Đăng nhập thành công, sinh JWT
    const token = jwt.sign({
      facebookId: req.user.id,
      username: req.user.displayName
    }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  }
);

app.use('/articles', articlesRouter);

https.createServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
}, app).listen(3000, () => {
  console.log('Server running at https://localhost:3000');
});
