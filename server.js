import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serves your index.html

// Optional: allow cross‑origin requests (useful if form is hosted elsewhere)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// -----------------------------
// Email Transporter (Gmail)
// -----------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify SMTP connection on startup
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP connection failed:", err);
  } else {
    console.log("✅ SMTP server is ready to send emails.");
  }
});

// -----------------------------
// Routes
// -----------------------------

// Health check (useful for Render)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  console.log("📩 Incoming form submission:", req.body);

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    await transporter.sendMail({
      from: `"Form Demo" <${process.env.EMAIL_USER}>`,
      to: process.env.TARGET_EMAIL,
      subject: "New Form Submission",
      text: `Name: ${name}\nEmail: ${email}`
    });

    console.log("✅ Email sent successfully.");
    res.json({ message: "Email sent successfully!" });

  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
