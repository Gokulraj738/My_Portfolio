const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ================== Middlewares ==================
// Allow only your frontend Firebase URL
app.use(cors({
  origin: "https://portfolio-3db4c.web.app"
}));
app.use(bodyParser.json());

// ================== Contact API ==================
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject} (${name})`,
      text: `
You received a new message from your portfolio contact form:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    console.log("📩 Email sent successfully:", { name, email, subject, message });

    res.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Email sending error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error",
    });
  }
});

// ================== Test API ==================
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working 🚀",
  });
});

// ================== Start server ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
