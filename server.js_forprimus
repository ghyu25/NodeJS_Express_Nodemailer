import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static files from /public
app.use(express.static("public"));

// Handle form submission
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    // SMTP transport for Primus.ca
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // REQUIRED for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Primus servers sometimes require this
      }
    });

    // Verify connection first (helps debug)
    await transporter.verify();

    // Send the email
    await transporter.sendMail({
      from: `"Form Demo" <${process.env.EMAIL_USER}>`,
      to: process.env.TARGET_EMAIL,
      subject: "New Form Submission",
      text: `Name: ${name}\nEmail: ${email}`
    });

    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("SMTP ERROR DETAILS:");
    console.error(err);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
