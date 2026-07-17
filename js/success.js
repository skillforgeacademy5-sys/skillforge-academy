const status = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const reference = params.get("reference");

if (!reference) {
    status.innerHTML = "Invalid payment reference.";
        throw new Error("No payment reference.");
        }

        verifyPayment(reference);

        async function verifyPayment(reference) {

            try {

                    const response = await fetch(
                                "https://skillforge-api-octq.onrender.com/verify-payment",
                                            {
                                                            method: "POST",
                                                                            headers: {
                                                                                                "Content-Type": "application/json"
                                                                                                                },
                                                                                                                                body: JSON.stringify({ reference })
                                                                                                                                            }
                                                                                                                                                    );

                                                                                                                                                            const result = await response.json();

                                                                                                                                                                    if (!result.success) {
                                                                                                                                                                                status.innerHTML = "Payment verification failed.";
                                                                                                                                                                                            return;
                                                                                                                                                                                                    }

                                                                                                                                                                                                            // Save student email
                                                                                                                                                                                                                    localStorage.setItem("studentEmail", result.purchase.email);

                                                                                                                                                                                                                            // Save purchased course
                                                                                                                                                                                                                                    localStorage.setItem("courseId", result.purchase.course_id);

                                                                                                                                                                                                                                            // Redirect to the new access page
                                                                                                                                                                                                                                                    window.location.href = "course-access.html";

                                                                                                                                                                                                                                                        } catch (error) {

                                                                                                                                                                                                                                                                console.error(error);

                                                                                                                                                                                                                                                                        status.innerHTML = "Unable to verify payment.";

                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                            }