const auth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Please login to continue" });
  }
};

module.exports = auth;
