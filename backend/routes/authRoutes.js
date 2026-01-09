const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// TEST
router.get("/test", (req, res) => res.send("Auth OK"));
router.get("/me", auth, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});
router.get("/admin/test", auth, admin, (req, res) => {
  res.json({ message: "Admin route accessed ✔" });
});



module.exports = router;
