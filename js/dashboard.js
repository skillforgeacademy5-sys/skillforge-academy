async function loadDashboard() {

            // Check if the user is logged in
                const {
                        data: { session }
                            } = await supabase.auth.getSession();

                                if (!session) {

                                        window.location = "login.html";
                                                return;

                                                    }

                                                        // Show student's name
                                                            const fullname =
                                                                    session.user.user_metadata.fullname || "Student";

                                                                        document.querySelector("h1").innerHTML =
                                                                                `Welcome back, ${fullname} 👋`;

                                                                                    // Hide all paid courses initially
                                                                                        document.getElementById("web3Card").style.display = "none";
                                                                                            document.getElementById("aiCard").style.display = "none";

                                                                                                // Get purchases from Supabase
                                                                                                    const { data, error } = await supabase
                                                                                                            .from("purchases")
                                                                                                                    .select("*")
                                                                                                                            .eq("email", session.user.email)
                                                                                                                                    .eq("payment_status", "paid");

                                                                                                                                        if (error) {

                                                                                                                                                console.log(error);
                                                                                                                                                        return;

                                                                                                                                                            }

                                                                                                                                                                // Unlock purchased courses
                                                                                                                                                                    data.forEach((purchase) => {

                                                                                                                                                                            if (purchase.course_id === "web3") {

                                                                                                                                                                                        document.getElementById("web3Card").style.display = "block";

                                                                                                                                                                                                }

                                                                                                                                                                                                        if (purchase.course_id === "ai") {

                                                                                                                                                                                                                    document.getElementById("aiCard").style.display = "block";

                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                // Load dashboard
                                                                                                                                                                                                                                loadDashboard();

                                                                                                                                                                                                                                // Logout
                                                                                                                                                                                                                                document.getElementById("logoutBtn").addEventListener("click", async () => {

                                                                                                                                                                                                                                    await supabase.auth.signOut();

                                                                                                                                                                                                                                        window.location = "index.html";

                                                                                                                                                                                                                                        });
}