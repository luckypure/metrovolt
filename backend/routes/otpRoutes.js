const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
  checkVerification
} = require("../controllers/otpController");

// SEND OTP (PUBLIC)
router.post("/send", sendOTP);

// VERIFY OTP (PUBLIC)
router.post("/verify", verifyOTP);

// CHECK VERIFICATION (PUBLIC)
router.post("/check", checkVerification);

module.exports = router;
