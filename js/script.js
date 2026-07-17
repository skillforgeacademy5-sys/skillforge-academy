document.addEventListener("DOMContentLoaded", () => {
    const hiddenElements = document.querySelectorAll(".hidden");

    if (hiddenElements.length > 0 && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        });

        hiddenElements.forEach((element) => observer.observe(element));
    } else {
        hiddenElements.forEach((element) => element.classList.add("show"));
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    const siteHeader = document.querySelector(".site-header");

    if (siteHeader) {
        window.addEventListener("scroll", () => {
            siteHeader.classList.toggle("scrolled", window.scrollY > 20);
        });
    }

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.style.display = window.scrollY > 400 ? "block" : "none";
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const buyButtons = document.querySelectorAll(".buy-btn");

    buyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const course = button.dataset.course;
            const price = button.dataset.price;
            const id = button.dataset.id;

            window.location.href = `payment.html?course=${encodeURIComponent(course)}&price=${price}&id=${id}`;
        });
    });
});