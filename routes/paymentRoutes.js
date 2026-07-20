const express = require("express");
const axios = require("axios");

const savePurchase = require("../services/purchaseService");
const sendWelcomeEmail = require("../services/emailService");
const { generateAccessToken } = require("../services/tokenService");
const supabase = require("../config/supabase");

const router = express.Router();

// Use the Replit dev domain when running on Replit, otherwise fall back to GitHub Pages
const SUCCESS_PAGE = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}/success.html`
  : "https://skillforgeacademy5-sys.github.io/skillforge-academy/success.html";

const BOT_USERNAME =
  process.env.TELEGRAM_BOT_USERNAME || "Web3StudentsBot";

// ============================================================
// Initialize Payment
// ============================================================
router.post("/initialize-payment", async (req, res) => {
  try {
    const { email, amount, courseName, courseId, telegramLink, fullName } =
      req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Number(amount) * 100,
        callback_url: SUCCESS_PAGE,
        metadata: {
          courseId,
          courseName,
          telegramLink,
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
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
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

    // 1. Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const payment = response.data.data;

    if (payment.status !== "success") {
      return res.json({ success: false, message: "Payment failed." });
    }

    // 2. Guard against duplicate processing
    const { data: existing } = await supabase
      .from("purchases")
      .select("id")
      .eq("reference", payment.reference)
      .maybeSingle();

    if (existing) {
      // Already processed — return success without creating a new token
      return res.json({ success: true, redirect: SUCCESS_PAGE });
    }

    // 3. Save the purchase record
    const purchase = await savePurchase(payment);

    // 4. Generate a secure one-time access token
    const token = await generateAccessToken(purchase.id);

    // 5. Build the Telegram deep link
    const telegramDeepLink = `https://t.me/${BOT_USERNAME}?start=${token}`;

    // 6. Send the welcome email with the deep link
    const firstName =
      purchase.full_name
        ? purchase.full_name.split(" ")[0]
        : payment.customer.first_name || "";

    await sendWelcomeEmail(
      payment.customer.email,
      firstName,
      payment.metadata.courseName,
      payment.reference,
      telegramDeepLink
    );

    res.json({
      success:     true,
      telegramLink: telegramDeepLink,
      studentName:  purchase.full_name || payment.customer.first_name || "Student",
      courseName:   payment.metadata.courseName || "SkillForge Course",
      amountPaid:   `₦${(payment.amount / 100).toLocaleString("en-NG")}`,
      paymentDate:  new Date(payment.paid_at || Date.now()).toLocaleDateString("en-NG", {
        year: "numeric", month: "long", day: "numeric",
      }),
      reference:    payment.reference,
    });
  } catch (err) {
    console.error("verify-payment error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Verification failed." });
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
