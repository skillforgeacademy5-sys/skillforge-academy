const email = localStorage.getItem("studentEmail");

if (!email) {

        alert("No purchased courses found.");

            window.location.href = "index.html";

}

loadDashboard();

async function loadDashboard() {

        try {

                    const response = await fetch(

                                    `https://skillforge-api-octq.onrender.com/dashboard/${email}`

                    );

                            const result = await response.json();

                                    if (!result.success) {

                                                    alert(result.message);

                                                                return;

                                    }

                                            document.getElementById("studentName").textContent = email;

                                                    const container = document.getElementById("courseContainer");

                                                            container.innerHTML = "";

                                                                    if (result.courses.length === 0) {

                                                                                    container.innerHTML = `

                                                                                                    <div class="dashboard-card">

                                                                                                                        <h3>No Purchased Courses</h3>

                                                                                                                                        </div>

                                                                                                                                                    `;

                                                                                                                                                                return;

                                                                    }

                                                                            result.courses.forEach(course => {

                                                                                            container.innerHTML += `

                                                                                                        <div class="dashboard-card">

                                                                                                                        <h2>${course.course_name}</h2>

                                                                                                                                        <p>Payment Confirmed ✅</p>

                                                                                                                                                        <a

                                                                                                                                                                        href="course.html?id=${course.course_id}"

                                                                                                                                                                                        class="btn">

                                                                                                                                                                                                        Open Course

                                                                                                                                                                                                                        </a>

                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                `;

                                                                            });

        }

            catch (err) {

                        console.log(err);

            }

}

