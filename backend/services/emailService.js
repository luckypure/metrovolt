const nodemailer = require("nodemailer");

// Create transporter (configure in .env)
const createTransporter = () => {
  // For development, use Gmail or configure SMTP
  // For production, use proper SMTP service
  return nodemailer.createTransport({
    
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking confirmation email
exports.sendBookingEmail = async (booking) => {
  try {
    // If email not configured, just log (for development)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("📧 Email not configured. Booking details:", {
        to: booking.customerInfo.email,
        subject: "MetroVolt - Test Ride Booking Confirmation",
        bookingId: booking._id,
        scooter: booking.scooter.name,
        showroom: booking.showroom.name,
        date: booking.bookingDate,
        time: booking.bookingTime
      });
      return;
    }

    const transporter = createTransporter();

    const bookingDate = new Date(booking.bookingDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const mailOptions = {
      from: `"MetroVolt" <${process.env.EMAIL_USER}>`,
      to: booking.customerInfo.email,
      subject: "MetroVolt - Test Ride Booking Confirmation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #4f46e5; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: bold; color: #6b7280; }
            .info-value { color: #111827; }
            .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ MetroVolt</h1>
              <p>Test Ride Booking Confirmed!</p>
            </div>
            <div class="content">
              <p>Dear ${booking.customerInfo.name},</p>
              <p>Thank you for booking a test ride with MetroVolt! Your booking has been confirmed.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #4f46e5;">Booking Details</h3>
                <div class="info-row">
                  <span class="info-label">Booking ID:</span>
                  <span class="info-value">${booking._id}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Scooter Model:</span>
                  <span class="info-value">${booking.scooter.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Price:</span>
                  <span class="info-value">$${booking.scooter.price}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Booking Date:</span>
                  <span class="info-value">${bookingDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Booking Time:</span>
                  <span class="info-value">${booking.bookingTime}</span>
                </div>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #4f46e5;">Showroom Information</h3>
                <div class="info-row">
                  <span class="info-label">Showroom:</span>
                  <span class="info-value">${booking.showroom.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Address:</span>
                  <span class="info-value">${booking.showroom.address}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">City:</span>
                  <span class="info-value">${booking.showroom.city}</span>
                </div>
                ${booking.showroom.phone ? `
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${booking.showroom.phone}</span>
                </div>
                ` : ""}
              </div>

              ${booking.notes ? `
              <div class="info-box">
                <p><strong>Your Notes:</strong></p>
                <p>${booking.notes}</p>
              </div>
              ` : ""}

              <p><strong>Important:</strong> Please arrive 10 minutes before your scheduled time. Bring a valid ID and driver's license.</p>
              
              <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
              
              <p>We look forward to seeing you!</p>
              
              <p>Best regards,<br>The MetroVolt Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} MetroVolt. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Booking confirmation email sent to:", booking.customerInfo.email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  // If email not configured, just log (for development)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n📧 ========================================");
    console.log("📧 EMAIL NOT CONFIGURED - DEVELOPMENT MODE");
    console.log("📧 ========================================");
    console.log(`📧 To: ${email}`);
    console.log(`📧 OTP Code: ${otp}`);
    console.log(`📧 Expires in: 10 minutes`);
    console.log("📧 ========================================\n");
    // Return successfully - don't throw error
    return { success: true, mode: "development", otp };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"MetroVolt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MetroVolt - Email Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px dashed #4f46e5; }
            .otp-code { font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ MetroVolt</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up with MetroVolt! Please use the verification code below to verify your email address:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your verification code:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">This code will expire in 10 minutes</p>
              </div>

              <div class="warning">
                <p style="margin: 0; color: #92400e;"><strong>⚠️ Security Notice:</strong></p>
                <p style="margin: 5px 0 0 0; color: #92400e; font-size: 12px;">
                  Never share this code with anyone. MetroVolt will never ask for your verification code.
                </p>
              </div>

              <p>If you didn't request this code, please ignore this email.</p>
              
              <p>Best regards,<br>The MetroVolt Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} MetroVolt. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
    return { success: true, mode: "production" };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    console.error("Error details:", error.message);
    throw error;
  }
};
