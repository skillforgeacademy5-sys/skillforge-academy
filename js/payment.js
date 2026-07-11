// ============================
// Get Course Information
// ============================

const params = new URLSearchParams(window.location.search);

const course = params.get("course");
const price = params.get("price");
const courseId = params.get("id");

document.getElementById("courseName").textContent = course;
document.getElementById("coursePrice").textContent =
    "₦" + Number(price).toLocaleString();

// ============================
// Backend URL
// ============================

const BACKEND =
"https://skillforge-api-octq.onrender.com";

// ============================
// Payment
// ============================

document
.getElementById("payButton")
.addEventListener("click", async () => {

    const email =
    document.getElementById("email").value.trim();

    if (!email) {

        alert("Enter your email.");

        return;

    }

    try {

        const response = await fetch(
            `${BACKEND}/initialize-payment`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email,

                    amount: Number(price),

                    course,

                    courseId

                })

            }
        );

        const data = await response.json();

        console.log(data);

        if (data.success) {

            window.location.href =
            data.authorization_url;

        } else {

            alert(data.message || "Could not initialize payment.");

        }

    } catch (err) {

        console.error(err);

        alert("Server connection failed.");

    }

});