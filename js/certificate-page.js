async function loadCertificatePage() {
        const {
                    data: { session }
        } = await supabase.auth.getSession();

            if (!session) {
                        window.location.href = "login.html";
                                return;
            }

                const user = session.user;

                    const { data: student } = await supabase
                            .from("students")
                                    .select("*")
                                            .eq("email", user.email)
                                                    .single();

                                                        const { data: certificate, error } = await supabase
                                                                .from("certificates")
                                                                        .select("*")
                                                                                .eq("user_id", user.id)
                                                                                        .order("issued_at", { ascending: false })
                                                                                                .limit(1)
                                                                                                        .single();

                                                                                                            if (error || !certificate) {
                                                                                                                        alert("No certificate found.");
                                                                                                                                window.location.href = "dashboard.html";
                                                                                                                                        return;
                                                                                                            }

                                                                                                                document.getElementById("studentName").textContent =
                                                                                                                        student?.full_name || user.email;

                                                                                                                            document.getElementById("courseName").textContent =
                                                                                                                                    certificate.course_name;

                                                                                                                                        document.getElementById("certificateId").textContent =
                                                                                                                                                certificate.certificate_id;

                                                                                                                                                    document.getElementById("issueDate").textContent =
                                                                                                                                                            new Date(certificate.issued_at).toLocaleDateString();
}

document
    .getElementById("downloadCertificate")
        .addEventListener("click", () => {
                    window.print();
        });

loadCertificatePage();
