const OTP = require("../models/OTP");
const { sendOTPEmail } = require("../services/emailService");

// GENERATE AND SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    const otpRecord = await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP via email
    try {
      const emailResult = await sendOTPEmail(email, otp);
      
      // If email is not configured (development mode), include OTP in response
      if (emailResult && emailResult.mode === "development") {
        res.json({
          message: "OTP generated successfully (Development Mode - Email not configured)",
          otp: otp, // Include OTP in response for development
          expiresIn: 600, // 10 minutes in seconds
          mode: "development",
          note: "Check server console for OTP. In production, this will be sent via email."
        });
      } else {
        res.json({
          message: "OTP sent successfully to your email",
          expiresIn: 600 // 10 minutes in seconds
        });
      }
    } catch (emailError) {
      // Delete OTP if email fails (only if email was supposed to be sent)
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await OTP.findByIdAndDelete(otpRecord._id);
        console.error("Email sending failed:", emailError);
        return res.status(500).json({
          message: "Failed to send OTP email. Please check your email configuration and try again.",
          error: emailError.message
        });
      } else {
        // Email not configured, but OTP was saved - return success with OTP
        res.json({
          message: "OTP generated successfully (Development Mode)",
          otp: otp,
          expiresIn: 600,
          mode: "development",
          note: "Check server console for OTP"
        });
      }
    }
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: err.message || "Failed to send OTP" });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, verified: false });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Check attempts (max 5 attempts)
    if (otpRecord.attempts >= 5) {
      await OTP.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({
        message: "Too many failed attempts. Please request a new OTP."
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      message: "Email verified successfully",
      verified: true
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: err.message || "Failed to verify OTP" });
  }
};

// CHECK IF EMAIL IS VERIFIED
exports.checkVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const verifiedOTP = await OTP.findOne({
      email,
      verified: true,
      expiresAt: { $gt: new Date() }
    });

    res.json({
      verified: !!verifiedOTP
    });
  } catch (err) {
    console.error("Check verification error:", err);
    res.status(500).json({ message: err.message || "Failed to check verification" });
  }
};
