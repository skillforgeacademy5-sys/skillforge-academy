const email = localStorage.getItem("studentEmail");

if (!email) {
    alert("No purchased courses found.");
    window.location.href = "index.html";
}

loadDashboard();

async function loadDashboard() {
    try {
        const response = await fetch(`https://skillforge-api-octq.onrender.com/dashboard/${email}`);
        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const studentNameElement = document.getElementById("studentName");
        const studentNameHeaderElement = document.getElementById("studentNameHeader");

        if (studentNameElement) {
            studentNameElement.textContent = email;
        }

        if (studentNameHeaderElement) {
            studentNameHeaderElement.textContent = email;
        }

        const container = document.getElementById("courseContainer");

        if (container) {
            container.innerHTML = "";

            if (result.courses.length === 0) {
                container.innerHTML = `
                    <div class="dashboard-course-card">
                        <h3>No Purchased Courses</h3>
                    </div>
                `;
                return;
            }

            result.courses.forEach(course => {
                let thumbnail = "images/default.jpg";
                let courseId = course.course_id || "";
                let courseName = course.course_name || "Course";
                let description = "Your premium course access is ready. Open the course portal to explore your next step.";

                if (courseId === "web3") {
                    thumbnail = "images/web3.jpg";
                    description = "Master blockchain, wallets, DeFi, and practical Web3 opportunities with premium guidance.";
                } else if (courseId === "ai") {
                    thumbnail = "images/ai.jpg";
                    description = "Build strong AI productivity habits with smart systems, automation, and modern workflows.";
                } else if (courseId === "crypto") {
                    thumbnail = "images/crypto.jog";
                    description = "Learn disciplined trading, market structure, and risk approach for the digital economy.";
                } else if (courseId === "freelancing") {
                    thumbnail = "images/ai.jpg";
                    description = "Grow a client-ready strategy for freelancing success and sustainable digital income.";
                }

                const query = new URLSearchParams({
                    courseId,
                    courseName,
                    thumbnail,
                    description
                }).toString();

                container.innerHTML += `
                    <article class="dashboard-course-card">
                        <img src="${thumbnail}" alt="${courseName}" class="dashboard-course-thumb">
                        <div class="dashboard-course-body">
                            <div class="dashboard-course-top">
                                <span class="course-pill"><i class="fa-solid fa-check"></i> Payment confirmed</span>
                                <span class="course-pill course-pill-soft"><i class="fa-solid fa-lock"></i> Premium access</span>
                            </div>
                            <h3>${courseName}</h3>
                            <p>${description}</p>
                            <a href="course-details.html?${query}" class="btn btn-primary">Open Course</a>
                        </div>
                    </article>
                `;
            });
        }
    } catch (err) {
        console.log(err);
    }
}

