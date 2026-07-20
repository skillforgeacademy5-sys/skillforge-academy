require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Health check
app.get("/api", (_req, res) => {
  res.json({ success: true, message: "🚀 SkillForge API Running Successfully" });
});

// Payment routes
app.use("/", paymentRoutes);

// Start HTTP server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 SkillForge API running on port ${PORT}`);
});

// Start Telegram bot — bot.js manages its own polling lifecycle
const bot = require("./bot/bot");

// Graceful shutdown: stop the HTTP server then the bot
function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => {
    if (bot && typeof bot.stopPolling === "function") {
      bot.stopPolling().finally(() => process.exit(0));
    } else {
      process.exit(0);
    }
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT",  () => shutdown("SIGINT"));
