const params = new URLSearchParams(window.location.search);

const reference = params.get("reference");

const status = document.getElementById("status");

if (!reference) {
        status.textContent = "Invalid payment reference.";
} else {
        verifyPayment(reference);
}

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

                if (result.success) {
                        status.textContent =
                                "Payment verified successfully. Redirecting...";

                        localStorage.setItem(
                                "studentEmail",
                                result.purchase.email
                        );

                        setTimeout(() => {
                                window.location.href = "dashboard.html";
                        }, 2000);
                } else {
                        status.textContent = result.message || "Payment verification failed.";
                }
        } catch (error) {
                console.error(error);
                status.textContent = "Unable to connect to the server.";
        }
}