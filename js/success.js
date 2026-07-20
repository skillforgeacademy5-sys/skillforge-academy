// Same-origin: frontend and backend are served by the same Express server
const BACKEND_URL = "";

const loadingEl   = document.getElementById("loading");
const errorEl     = document.getElementById("error-state");
const errorMsgEl  = document.getElementById("error-msg");
const successCard = document.getElementById("success-card");
const tgBtn       = document.getElementById("tg-btn");

// Enrollment card fields
const enrollName  = document.getElementById("enroll-name");
const enrollCourse= document.getElementById("enroll-course");
const enrollAmt   = document.getElementById("enroll-amount");
const enrollRef   = document.getElementById("enroll-reference");
const enrollDate  = document.getElementById("enroll-date");

const params    = new URLSearchParams(window.location.search);
const reference = params.get("reference");

function showError(msg) {
  loadingEl.style.display = "none";
  errorEl.style.display   = "flex";
  errorMsgEl.textContent  = msg || "We couldn't verify your payment. Please contact support.";
}

function populateCard(result) {
  if (result.telegramLink) {
    tgBtn.href = result.telegramLink;
  }
  if (enrollName)   enrollName.textContent   = result.studentName   || "—";
  if (enrollCourse) enrollCourse.textContent = result.courseName    || "—";
  if (enrollAmt)    enrollAmt.textContent    = result.amountPaid    || "—";
  if (enrollRef)    enrollRef.textContent    = result.reference     || reference || "—";
  if (enrollDate)   enrollDate.textContent   = result.paymentDate   || "—";
}

// ── Preview mode: append ?preview=1 to see the card without a real payment ──
if (params.get("preview") === "1") {
  populateCard({
    telegramLink: "https://t.me/Web3StudentsBot?start=preview",
    studentName:  "John Doe",
    courseName:   "Web3 Masterclass",
    amountPaid:   "₦15,000",
    reference:    "preview_ref_001",
    paymentDate:  new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }),
  });
  loadingEl.style.display    = "none";
  successCard.style.display  = "block";
} else if (!reference) {
  showError("No payment reference found. Please contact support.");
} else {
  verifyPayment(reference);
}

async function verifyPayment(ref) {
  try {
    const response = await fetch(`${BACKEND_URL}/verify-payment`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ reference: ref }),
    });

    const result = await response.json();

    if (!result.success) {
      showError("Payment verification failed. Please contact support.");
      return;
    }

    populateCard(result);

    loadingEl.style.display   = "none";
    successCard.style.display = "block";

  } catch (err) {
    console.error("Verification error:", err);
    showError("Unable to verify your payment. Please check your connection and try again.");
  }
}
