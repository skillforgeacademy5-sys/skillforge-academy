import { checkCourseCompletion } from "./certificate.js";

const supabase = window.supabase;

let currentUser = null;
let currentCourse = null;
let currentCourseName = null;
let currentLesson = null;

async function loadCourse() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = "login.html";
        return;
    }

    currentUser = session.user;

    const params = new URLSearchParams(window.location.search);
    currentCourse = params.get("id");

    if (!currentCourse) {
        alert("Course not found.");
        window.location.href = "courses.html";
        return;
    }

    const studentEmail = document.getElementById("studentEmail");
    if (studentEmail) {
        studentEmail.textContent = currentUser.email;
    }

    const { data: purchase, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("email", currentUser.email)
        .eq("course_id", currentCourse)
        .single();

    if (error || !purchase) {
        alert("You haven't purchased this course.");
        window.location.href = "courses.html";
        return;
    }

    currentCourseName = purchase.course || purchase.course_name || currentCourse;
    await loadLessons();
}

async function loadLessons() {
    const { data: lessons, error } = await supabase
        .from("course_lessons")
        .select("*")
        .eq("course_id", currentCourse)
        .order("lesson_number", { ascending: true });

    if (error) {
        console.error(error);
        alert("Unable to load lessons.");
        return;
    }

    const lessonList = document.getElementById("lessonList");
    lessonList.innerHTML = "";

    if (!lessons || lessons.length === 0) {
        lessonList.innerHTML = "<p>No lessons have been added yet.</p>";
        return;
    }

    document.getElementById("courseTitle").textContent = currentCourseName || lessons[0].course_id;

    lessons.forEach((lesson, index) => {
        const lessonDiv = document.createElement("div");
        lessonDiv.className = "lesson-item";
        lessonDiv.innerHTML = `
            <strong>Lesson ${lesson.lesson_number}</strong><br>
            ${lesson.lesson_title}
        `;
        lessonDiv.onclick = () => {
            openLesson(lesson);
        };
        lessonList.appendChild(lessonDiv);

        if (index === 0) {
            openLesson(lesson);
        }
    });

    await updateProgress();
}

function openLesson(lesson) {
    currentLesson = lesson;

    const lessonTitle = document.getElementById("lessonTitle");
    if (lessonTitle) {
        lessonTitle.textContent = lesson.lesson_title;
    }

    const lessonDescription = document.getElementById("lessonDescription");
    if (lessonDescription) {
        lessonDescription.textContent = lesson.lesson_description || "";
    }

    const video = document.getElementById("lessonVideo");
    if (video) {
        if (lesson.video_url) {
            video.style.display = "block";
            video.src = lesson.video_url;
        } else {
            video.style.display = "none";
            video.src = "";
        }
    }

    const pdf = document.getElementById("pdfDownload");
    if (pdf) {
        if (lesson.pdf_url) {
            pdf.style.display = "inline-block";
            pdf.href = lesson.pdf_url;
        } else {
            pdf.style.display = "none";
            pdf.href = "";
        }
    }

    const completeBtn = document.getElementById("completeLessonBtn");
    if (completeBtn) {
        completeBtn.style.display = "inline-block";
    }
}

async function completeLesson() {
    if (!currentLesson) return;

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        alert("Please log in again to complete the lesson.");
        return;
    }

    const { error } = await supabase.from("lesson_progress").upsert({
        user_id: session.user.id,
        lesson_id: currentLesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
    });

    if (error) {
        console.error(error);
        alert("Could not save lesson progress.");
        return;
    }

    const certificateId = await checkCourseCompletion(
        session.user.id,
        currentCourse,
        currentCourseName
    );

    if (certificateId) {
        alert(`🎉 Lesson completed! Your certificate ID is ${certificateId}`);
    } else {
        alert("🎉 Lesson completed!");
    }

    await updateProgress();
}

async function updateProgress() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return;
    }

    const { data: completed } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", session.user.id)
        .eq("completed", true);

    const { data: lessons } = await supabase
        .from("course_lessons")
        .select("id")
        .eq("course_id", currentCourse);

    if (!lessons || lessons.length === 0) return;

    const completedLessonIds = (completed || []).map((item) => item.lesson_id);
    const completedCount = lessons.filter((lesson) =>
        completedLessonIds.includes(lesson.id)
    ).length;

    const percentage = Math.round((completedCount / lessons.length) * 100);

    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        progressBar.value = percentage;
    }

    const progressText = document.getElementById("progressText");
    if (progressText) {
        progressText.textContent = `${percentage}% Completed`;
    }
}

document.getElementById("completeLessonBtn")?.addEventListener("click", completeLesson);

loadCourse();
                                                                                                                                                                                                            