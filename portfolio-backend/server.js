const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// ================== Middlewares ==================
app.use(cors());
app.use(bodyParser.json());

// ================== Contact API ==================
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  try {
    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // shows visitor's name
      to: process.env.EMAIL_USER,                  // your inbox
      replyTo: email,                              // visitor's email for replies
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
