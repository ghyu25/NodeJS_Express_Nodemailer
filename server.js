import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Form submission route
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  console.log("📩 Incoming form submission:", req.body);

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    const data = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",   // No domain verification needed
      to: process.env.TARGET_EMAIL.split(",").map(s => s.trim()),
      subject: "New Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `
    });

    console.log("✅ Email sent:", data);
    res.json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("❌ Resend error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
