const authenticate = (req, res, next) => {
  if (req.session && req.session.user === "admin") {
    return next();
  }
  return res.status(401).send("Unauthorized");
};

module.exports = authenticate;
