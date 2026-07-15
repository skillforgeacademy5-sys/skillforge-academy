document.getElementById("continueBtn").addEventListener("click", () => {

    const email = document.getElementById("email").value.trim();

    if (!email) {

    alert("Please enter your email.");

    return;

    }

    localStorage.setItem("studentEmail", email);

    window.location.href = "dashboard.html";

    });
