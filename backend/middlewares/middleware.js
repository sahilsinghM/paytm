const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../db");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer")) {
    return res.status(403).json({ msg: "invalid auth header" + auth });
  }
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: err });
  }
};

module.exports = authMiddleware;
