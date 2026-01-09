const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // token comes like:  Bearer xxxxx
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // store user info in request

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth;
