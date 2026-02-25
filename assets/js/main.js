const pages = [
    "pages/index.html",
    "pages/services.html",
    "pages/clients.html",
    "pages/contact.html"
];

let currentPageIndex = 0;
let isLoading = false;

async function loadNextPage() {
    if (isLoading || currentPageIndex >= pages.length) return;

    isLoading = true;

    const content = document.getElementById("content");

    try {
        const response = await fetch(pages[currentPageIndex]);
        const html = await response.text();

        const section = document.createElement("section");
        section.innerHTML = html;

        content.appendChild(section);

        currentPageIndex++;

        observeLastSection();

    } catch (e) {
        console.error("Ошибка загрузки страницы:", e);
    }

    isLoading = false;
}

function observeLastSection() {
    const sections = document.querySelectorAll("#content section");
    const lastSection = sections[sections.length - 1];

    if (!lastSection) return;

    observer.observe(lastSection);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            loadNextPage();
        }
    });
}, {
    rootMargin: "200px" // подгрузка заранее
});

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("DOMContentLoaded", () => {
    loadNextPage(); // первая секция
});

document.addEventListener("DOMContentLoaded", () => {

  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".nav-overlay");

  if (!burger || !navLinks || !overlay) return;

  function openMenu() {
    burger.classList.add("active");
    navLinks.classList.add("open");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    burger.classList.remove("active");
    navLinks.classList.remove("open");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  burger.addEventListener("click", () => {
    navLinks.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

});