const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.token;
  if (!token) {
    return res.status(403).send("Token requis");
  }
  try {
    if (token != config.TOKEN_KEY) {
      return res.status(401).send("Token invalide");
    }
  } catch (err) {
    return res.status(401).send("Token invalide");
  }
  return next();
};

module.exports = verifyToken;
