require("dotenv").config();
const nodemailer = require("nodemailer");

// ✅ Transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 465 = true, 587 = false
  auth: {
    user: `${process.env.NODEMAILER_EMAIL}`, 
    pass: `${process.env.NODEMAILER_PASSWORD}`, // App Password (Google Security → App Passwords)
  },
});

// ✅ Function to send email with design
const SendEmail = async (to, subject, otp) => {
  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee;">
        <!-- Header -->
        <div style="text-align: center; padding: 15px; background: linear-gradient(90deg, #6C63FF, #3B82F6); border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">Shopmart</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #333;">🔑 Password Reset OTP</h2>
          <p style="font-size: 16px; color: #555;">Use the following OTP to reset your password. This code is valid for <b>2 minutes</b>.</p>
          
          <div style="margin: 20px auto; display: inline-block; padding: 15px 30px; background: #FF5722; color: white; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #666;">If you didn’t request this, please ignore this email.</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 10px; font-size: 12px; color: gray;">
          © ${new Date().getFullYear()} Shopmart. All rights reserved. <br/>
          Need help? Contact <a href="mailto:leptoptz@gmail.com" style="color:#3B82F6;">support</a>.
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"SHOPMART RESET PASSWORD OTP" <leptoptz@gmail.com>',
      to,
      subject,
      text: `Your OTP is: ${otp}`,
      html: htmlTemplate,
    });

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { SendEmail };
