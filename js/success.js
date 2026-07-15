const status = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const reference = params.get("reference");

if (!reference) {
    status.textContent = "Invalid payment reference.";
    throw new Error("No payment reference found.");
}

verifyPayment(reference);

async function verifyPayment(reference) {
    try {
        const response = await fetch(
            "https://skillforge-api-octq.onrender.com/verify-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reference }),
            }
        );

        const result = await response.json();

        if (!result.success) {
            status.textContent = result.message || "Payment verification failed.";
            return;
        }

        localStorage.setItem("studentEmail", result.purchase.email);

        status.textContent = "Payment verified successfully! Redirecting...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
    } catch (error) {
        console.error(error);

        status.textContent =
            "Unable to verify payment. Please contact SkillForge support.";
    }
}