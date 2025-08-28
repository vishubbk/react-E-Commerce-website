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
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f5f7fa;
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #6366F1, #4F46E5);
            text-align: center;
            padding: 30px 20px;
          }
          .header h1 {
            color: #fff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .lock-icon {
            margin-top: 15px;
            background: #fff;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-size: 24px;
          }
          .body {
            padding: 40px 30px;
            text-align: center;
          }
          .body h2 {
            color: #111827;
            font-size: 22px;
            margin-bottom: 10px;
          }
          .body p {
            color: #6B7280;
            font-size: 15px;
            line-height: 22px;
            margin-bottom: 30px;
          }
          .otp-box {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px auto 25px;
          }
          .otp-digit {
            background: #f3f4f6;
            padding: 14px 18px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            font-size: 22px;
            font-weight: bold;
            color: #4F46E5;
            font-family: monospace;
          }
          .expire {
            font-size: 13px;
            color: #DC2626;
            margin-top: -10px;
            margin-bottom: 30px;
          }
          .footer {
            border-top: 1px solid #E5E7EB;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9CA3AF;
          }
          .footer a {
            color: #4F46E5;
            text-decoration: none;
          }
          @media (max-width: 480px) {
            .body {
              padding: 30px 15px;
            }
            .body h2 {
              font-size: 20px;
            }
            .otp-digit {
              font-size: 18px;
              padding: 12px 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Shopmart</h1>
            <div class="lock-icon">🔐</div>
          </div>

          <!-- Body -->
          <div class="body">
            <h2>Password Reset Code</h2>
            <p>We received a request to reset your password. Please use the OTP below to continue:</p>

            <div class="otp-box">
              ${otp.split("").map((digit) => `<div class="otp-digit">${digit}</div>`).join("")}
            </div>
            <p class="expire">⚠️ This code expires in 2 minutes</p>

            <p>If you didn’t request this, you can safely ignore this email.</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            © ${new Date().getFullYear()} Shopmart. All rights reserved. <br>
            Need help? <a href="mailto:support@shopmart.com">Contact Support</a>
          </div>
        </div>
      </body>
      </html>
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
