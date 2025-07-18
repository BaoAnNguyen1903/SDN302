const express = require("express");
const app = express();
const OAuth = require("oauth").OAuth;

const oauth = new OAuth(
  "https://api.example.com/oauth/request_token",
  "https://api.example.com/oauth/access_token",
  "your_consumer_key",
  "your_consumer_secret",
  "1.0",
  "https://localhost:3000/auth/callback",
  "HMAC-SHA1"
);

app.get("/auth/facebook", (req, res) => {
  oauth.getOAuthRequestToken((err, oauthToken, oauthTokenSecret, results) => {
    if (err) return res.send("OAuth Request Error: " + JSON.stringify(err));

    // Lưu vào session hoặc tạm biến (giả lập)
    req.session = { oauthToken, oauthTokenSecret };

    // Chuyển hướng đến trang đăng nhập dịch vụ OAuth
    res.redirect("https://api.example.com/oauth/authorize?oauth_token=" + oauthToken);
  });
});

// Callback sau khi đăng nhập xong
app.get("/auth/callback", (req, res) => {
  const { oauthToken, oauthVerifier } = req.query;
  const { oauthTokenSecret } = req.session;

  oauth.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, (err, accessToken, accessSecret) => {
    if (err) return res.send("OAuth Access Error: " + JSON.stringify(err));

    // Lấy thông tin user
    oauth.get("https://api.example.com/user", accessToken, accessSecret, (err, data) => {
      if (err) return res.send("Get User Error: " + JSON.stringify(err));
      res.send("Logged in user: " + data);
    });
  });
});

module.exports = app;
