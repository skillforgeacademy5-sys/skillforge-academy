// ============================
// Scroll Animation
// ============================

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

hiddenElements.forEach((element) => {

    observer.observe(element);

});// ============================
// Mobile Menu
// ============================

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});// ============================
// Back To Top Button
// ============================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if(window.scrollY > 400){

        backToTop.style.display = "block";

    }else{

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});