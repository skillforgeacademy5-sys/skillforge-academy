const BACKEND_URL = window.BACKEND_URL || "https://skillforge-api-octq.onrender.com";

const loadingEl    = document.getElementById("loading");
const errorEl      = document.getElementById("error-state");
const errorMsgEl   = document.getElementById("error-msg");
const successCard  = document.getElementById("success-card");
const tgBtn        = document.getElementById("tg-btn");

const params    = new URLSearchParams(window.location.search);
const reference = params.get("reference");

function showError(msg) {
  loadingEl.style.display  = "none";
  errorEl.style.display    = "flex";
  errorMsgEl.textContent   = msg || "We couldn't verify your payment. Please contact support.";
}

// Preview mode — append ?preview=1 to the URL to see the card design
if (params.get("preview") === "1") {
  tgBtn.href = "https://t.me/Web3StudentsBot?start=preview";
  loadingEl.style.display  = "none";
  successCard.style.display = "block";
} else if (!reference) {
  showError("No payment reference found. Please contact support.");
} else {
  verifyPayment(reference);
}

async function verifyPayment(reference) {
  try {
    const response = await fetch(`${BACKEND_URL}/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });

    const result = await response.json();

    if (!result.success) {
      showError("Payment verification failed. Please contact support.");
      return;
    }

    // Wire up the "Open My Course" deep link returned by the server
    if (result.telegramLink) {
      tgBtn.href = result.telegramLink;
    }

    // Show the success card
    loadingEl.style.display  = "none";
    successCard.style.display = "block";

  } catch (err) {
    console.error("Verification error:", err);
    showError("Unable to verify your payment. Please check your connection and try again.");
  }
}
