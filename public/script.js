const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/submit"
    : "https://nodejs-express-nodemailer.onrender.com/submit";

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const status = document.getElementById("status");

  status.style.color = "black";
  status.textContent = "Sending...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();

    if (res.ok) {
      status.style.color = "green";
      status.textContent = data.message;
    } else {
      status.style.color = "red";
      status.textContent = data.message || "Failed to send email.";
    }
  } catch (err) {
    status.style.color = "red";
    status.textContent = "Network error — could not reach server.";
  }
});
