require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
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
