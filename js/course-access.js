const emailInput = document.getElementById("email");
const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();

        if (!email) {
                alert("Enter the email used during payment.");
                        return;
                            }

                                localStorage.setItem("studentEmail", email);

                                    try {

                                            const response = await fetch(
                                                        `https://skillforge-api-octq.onrender.com/dashboard/${email}`
                                                                );

                                                                        const result = await response.json();

                                                                                if (!result.success) {
                                                                                            alert(result.message);
                                                                                                        return;
                                                                                                                }

                                                                                                                        if (result.courses.length === 0) {
                                                                                                                                    alert("No purchased course found.");
                                                                                                                                                return;
                                                                                                                                                        }

                                                                                                                                                                const course = result.courses[0];

                                                                                                                                                                        let telegramBot = "https://t.me/skillforgeweb3bot";

                                                                                                                                                                                if (course.course_id === "web3") {
                                                                                                                                                                                            telegramBot = "https://t.me/skillforgeweb3bot";
                                                                                                                                                                                                    }

                                                                                                                                                                                                            if (course.course_id === "ai") {
                                                                                                                                                                                                                        telegramBot = "https://t.me/skillforgeaibot";
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                        if (course.course_id === "crypto") {
                                                                                                                                                                                                                                                    telegramBot = "https://t.me/skillforgeweb3bot";
                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                    window.location.href = telegramBot;

                                                                                                                                                                                                                                                                        } catch (err) {
                                                                                                                                                                                                                                                                                console.error(err);
                                                                                                                                                                                                                                                                                        alert("Unable to verify your purchase.");
                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                            });