const supabase = window.supabase;

async function loadDashboard() {
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

    document.getElementById("studentName").textContent =
        student?.full_name || user.email;

    document.getElementById("studentNameTitle").textContent =
        student?.full_name || user.email;

    const { data: purchases, error: purchaseError } = await supabase
        .from("purchases")
        .select("*")
        .eq("email", user.email);

    if (purchaseError) {
        console.error(purchaseError);
        return;
    }

    document.getElementById("courseCount").textContent = purchases?.length || 0;

    const { data: certificates, error: certificateError } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id);

    if (certificateError) {
        console.error(certificateError);
    }

    document.getElementById("certificateCount").textContent =
        certificates?.length || 0;

    const { data: completedLessons, error: completedError } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", true);

    if (completedError) {
        console.error(completedError);
    }

    const { data: allLessons, error: lessonsError } = await supabase
        .from("course_lessons")
        .select("*");

    if (lessonsError) {
        console.error(lessonsError);
    }

    let progress = 0;
    if (allLessons && allLessons.length > 0) {
        progress = Math.round(
            ((completedLessons?.length || 0) / allLessons.length) * 100
        );
    }

    document.getElementById("progressPercent").textContent = `${progress}%`;

    const container = document.getElementById("courseContainer");
    container.innerHTML = "";

    if (!purchases || purchases.length === 0) {
        container.innerHTML = `
            <div class="dashboard-card">
                <h3>No courses yet</h3>
                <p>Purchase a course to begin learning.</p>
                <a href="courses.html" class="btn">Browse Courses</a>
            </div>
        `;
        return;
    }

    purchases.forEach((course) => {
        const card = document.createElement("div");
        card.className = "dashboard-card";
        card.innerHTML = `
            <h3>

            ${course.course_name}

            </h3>

            <p>

            Purchased Successfully

            </p>

            <div class="progress">

            <div class="progress-fill"

            style="width:${progress}%">

            </div>

            </div>

            <p>

            ${progress}% Complete

            </p>

            <a

            href="course.html?id=${course.course_id}"

            class="btn">

            Continue Learning

            </a>

        `;
        container.appendChild(card);
    });
}

loadDashboard();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        await supabase.auth.signOut();
        window.location.href = "index.html";
    });
}
