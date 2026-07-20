require("dotenv").config();

const { TelegramBot } = require("node-telegram-bot-api");
const { validateAndConsumeToken } = require("../services/tokenService");

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN is not set. Bot will not start.");
  module.exports = null;
  return;
}

// Create the bot WITHOUT auto-starting polling so we can delete
// any stale webhook/session first (prevents 409 Conflict on restarts).
const bot = new TelegramBot(token, { polling: false });

bot
  .deleteWebhook({ drop_pending_updates: true })
  .then(() => {
    bot.startPolling({ restart: false });
    console.log("🤖 Telegram bot started (polling)");
  })
  .catch((err) => {
    console.error("❌ Failed to start Telegram bot:", err.message);
  });

// ── /start <access_token> ──────────────────────────────────────────────────
bot.onText(/\/start ?(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const param  = (match[1] || "").trim();

  // No token supplied — generic welcome
  if (!param) {
    return bot.sendMessage(
      chatId,
      "👋 Welcome to *SkillForge Digital Academy*!\n\n" +
        "To unlock your course, click the personalised link you received in your welcome email after payment.",
      { parse_mode: "Markdown" }
    );
  }

  try {
    const result = await validateAndConsumeToken(param, chatId);

    if (!result.valid) {
      const messages = {
        invalid:
          "❌ *Access denied.* This link is invalid.\n\nPlease double-check your welcome email or contact support.",
        used:
          "❌ *This link has already been used.*\n\nEach access link can only be redeemed once. If you believe this is an error, contact support.",
        payment_not_confirmed:
          "❌ *Payment not confirmed.*\n\nWe could not verify a successful payment for this link. Please contact support.",
      };

      return bot.sendMessage(
        chatId,
        messages[result.reason] || "❌ Access denied. Please contact support.",
        { parse_mode: "Markdown" }
      );
    }

    const { purchase } = result;
    const greeting = purchase.full_name
      ? `Welcome, *${purchase.full_name}*! 🎉`
      : "🎉 Access granted!";

    await bot.sendMessage(
      chatId,
      `✅ ${greeting}\n\n` +
        `📚 *Course:* ${purchase.course_name}\n` +
        `📧 *Email:* ${purchase.email}\n\n` +
        `Your course has been unlocked. You now have full access to all course materials.\n\n` +
        `_Learn Smarter. Earn Better. Build Your Future._ 🚀`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error("Bot token validation error:", err.message);
    await bot.sendMessage(
      chatId,
      "⚠️ Something went wrong while verifying your access. Please try again or contact support."
    );
  }
});

// ── Error handling ─────────────────────────────────────────────────────────
bot.on("polling_error", (err) => {
  // 409 after a clean restart is expected briefly — suppress it
  if (!err.message.includes("409")) {
    console.error("Telegram polling error:", err.message);
  }
});

// ── Graceful shutdown ──────────────────────────────────────────────────────
function stopBot() {
  bot.stopPolling().catch(() => {});
}
process.once("SIGTERM", stopBot);
process.once("SIGINT",  stopBot);

module.exports = bot;
