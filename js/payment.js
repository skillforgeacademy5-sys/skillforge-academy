// ============================
// Get Course Information
// ============================

const params = new URLSearchParams(window.location.search);

const course = params.get("course");
const price = params.get("price");
const courseId = params.get("id");

document.getElementById("courseName").textContent = course || "Course";

document.getElementById("coursePrice").textContent =
    "₦" + Number(price || 0).toLocaleString();

// ============================
// Backend URL
// ============================

const BACKEND = window.BACKEND_URL || "https://skillforge-api-octq.onrender.com";

// ============================
// Payment
// ============================

const payButton = document.getElementById("payButton");

payButton.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Please enter your email.");
        return;
    }

    payButton.disabled = true;
    payButton.textContent = "Processing...";

    try {

        const response = await fetch(`${BACKEND}/initialize-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: Number(price),
                courseName: course,
                courseId,
            }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok && data.success) {
            window.location.href = data.authorization_url;
            return;
        }

        alert(data.message || "Could not initialize payment.");

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server. Please try again.");

    } finally {

        payButton.disabled = false;
        payButton.textContent = "Pay Now";

    }

});