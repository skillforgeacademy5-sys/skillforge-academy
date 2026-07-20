require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Health check (API only — static middleware handles the root HTML)
app.get("/api", (req, res) => {
  res.json({ success: true, message: "🚀 SkillForge API Running Successfully" });
});

// Payment routes
app.use("/", paymentRoutes);

// Start HTTP server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SkillForge API running on port ${PORT}`);
});

// Start Telegram bot (non-blocking — errors are logged inside bot.js)
require("./bot/bot");
