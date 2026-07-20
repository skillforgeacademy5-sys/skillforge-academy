const express = require("express");
const axios   = require("axios");

const savePurchase        = require("../services/purchaseService");
const sendWelcomeEmail    = require("../services/emailService");
const { generateAccessToken } = require("../services/tokenService");
const supabase            = require("../config/supabase");

const router = express.Router();

// Use the Replit dev domain when running on Replit, otherwise fall back to GitHub Pages
const SUCCESS_PAGE = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}/success.html`
  : "https://skillforgeacademy5-sys.github.io/skillforge-academy/success.html";

const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "Web3StudentsBot";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso || Date.now()).toLocaleDateString("en-NG", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatAmount(nairaFloat) {
  return `₦${Number(nairaFloat).toLocaleString("en-NG")}`;
}

// ============================================================
// Initialize Payment
// ============================================================
router.post("/initialize-payment", async (req, res) => {
  try {
    const { email, amount, courseName, courseId, fullName } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ success: false, message: "email and amount are required." });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(Number(amount) * 100),
        callback_url: SUCCESS_PAGE,
        metadata: {
          courseId,
          courseName,
          fullName: fullName || "",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success:           true,
      authorization_url: response.data.data.authorization_url,
      reference:         response.data.data.reference,
    });
  } catch (err) {
    console.error("initialize-payment error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Unable to initialize payment." });
  }
});

// ============================================================
// Verify Payment
// ============================================================
router.post("/verify-payment", async (req, res) => {
  try {
    const { reference } = req.body;

    // ── 0. Input validation ────────────────────────────────
    if (!reference) {
      return res.status(400).json({ success: false, message: "Payment reference is required." });
    }

    // ── 1. Verify with Paystack ────────────────────────────
    const psResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const payment = psResponse.data.data;

    if (payment.status !== "success") {
      return res.json({ success: false, message: "Payment has not been completed." });
    }

    // ── 2. Duplicate guard ─────────────────────────────────
    //    Select all columns needed for the response so we can return
    //    the full data to the success page without a second round-trip.
    const { data: existing } = await supabase
      .from("purchases")
      .select("id, full_name, course_name, amount, reference, purchase_date")
      .eq("reference", payment.reference)
      .maybeSingle();

    if (existing) {
      // Payment already processed — look up the token that was issued
      const { data: tokenRecord } = await supabase
        .from("access_tokens")
        .select("token, used")
        .eq("purchase_id", existing.id)
        .maybeSingle();

      const telegramLink = tokenRecord
        ? `https://t.me/${BOT_USERNAME}?start=${tokenRecord.token}`
        : null;

      return res.json({
        success:      true,
        alreadyProcessed: true,
        telegramLink,
        studentName:  existing.full_name  || payment.customer?.first_name || "Student",
        courseName:   existing.course_name || payment.metadata?.courseName  || "SkillForge Course",
        amountPaid:   formatAmount(existing.amount),
        paymentDate:  formatDate(existing.purchase_date),
        reference:    existing.reference,
      });
    }

    // ── 3. Save purchase record ────────────────────────────
    const purchase = await savePurchase(payment);

    // ── 4. Generate one-time access token ─────────────────
    const token = await generateAccessToken(purchase.id);

    // ── 5. Build Telegram deep link ────────────────────────
    const telegramDeepLink = `https://t.me/${BOT_USERNAME}?start=${token}`;

    // ── 6. Send welcome email (non-blocking) ───────────────
    //    Never let an email failure break the payment response.
    const firstName = purchase.full_name
      ? purchase.full_name.split(" ")[0]
      : payment.customer?.first_name || "";

    sendWelcomeEmail(
      payment.customer.email,
      firstName,
      payment.metadata?.courseName,
      payment.reference,
      telegramDeepLink
    ).catch((emailErr) => {
      console.error("Welcome email failed (non-fatal):", emailErr.message);
    });

    // ── 7. Respond to the success page ────────────────────
    return res.json({
      success:      true,
      telegramLink: telegramDeepLink,
      studentName:  purchase.full_name || payment.customer?.first_name || "Student",
      courseName:   payment.metadata?.courseName || "SkillForge Course",
      amountPaid:   formatAmount(payment.amount / 100),
      paymentDate:  formatDate(payment.paid_at),
      reference:    payment.reference,
    });

  } catch (err) {
    console.error("verify-payment error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Verification failed. Please contact support." });
  }
});

// ============================================================
// List Students (admin)
// ============================================================
router.get("/students", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .order("purchase_date", { ascending: false });

    if (error) throw error;
    res.json({ success: true, students: data });
  } catch (err) {
    console.error("students error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch students." });
  }
});

module.exports = router;
