 // ============================
// Scroll Animation
// ============================

const hiddenElements = document.querySelectorAll(".hidden");

if (hiddenElements.length > 0) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    });

    hiddenElements.forEach((element) => {

        observer.observe(element);

    });
 
}

// ============================
// Mobile Menu
// ============================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

}

// ============================
// Back To Top Button
// ============================

const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.style.display = "block";

        } else {

            backToTop.style.display = "none";

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

}

// ============================
// Buy Now Button
// ============================

const buyButtons = document.querySelectorAll(".buy-btn");

buyButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const course = button.dataset.course;
        const price = button.dataset.price;
        const id = button.dataset.id;

        window.location.href =
            `payment.html?course=${encodeURIComponent(course)}&price=${price}&id=${id}`;

    });

});