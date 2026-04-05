const MOBILE_BREAKPOINT = 768;

const galleryImages = [
    {
        url: "HTML/1.jpg",
        title: "Edificio principal",
        description: "Vista del frente de nuestra escuela técnica."
    },
    {
        url: "HTML/2.jpg",
        title: "Vida escolar",
        description: "Momentos cotidianos dentro de la comunidad educativa."
    },
    {
        url: "HTML/3.jpg",
        title: "Espacios institucionales",
        description: "Instalaciones pensadas para aprender, crear y compartir."
    },
    {
        url: "HTML/slider1.jpg",
        title: "Trayectoria institucional",
        description: "Una escuela con historia y compromiso en La Plata."
    },
    {
        url: "HTML/slider2.jpg",
        title: "Comunidad técnica",
        description: "Estudiantes y docentes construyendo proyectos con identidad propia."
    },
    {
        url: "HTML/slider3.jpg",
        title: "Aprendizaje en acción",
        description: "Formación práctica en talleres y laboratorios."
    },
    {
        url: "HTML/slider4.jpg",
        title: "Orgullo EEST N°5",
        description: "Una institución pública que mira al futuro."
    }
];

let currentImageIndex = 0;

function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function updateHeaderOnScroll() {
    const header = document.getElementById("header");
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
}

function syncMenuState(forceOpen = false) {
    const menu = document.getElementById("menu");
    const menuToggle = document.getElementById("menuToggle");

    if (!menu || !menuToggle) return;

    const desktop = !isMobileView();
    const shouldOpen = desktop || forceOpen;

    menu.classList.toggle("is-open", shouldOpen && !desktop);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen && !desktop));
    menuToggle.innerHTML = shouldOpen && !desktop
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
}

function setupMenu() {
    const menu = document.getElementById("menu");
    const menuToggle = document.getElementById("menuToggle");

    if (!menu || !menuToggle) return;

    syncMenuState(false);

    menuToggle.addEventListener("click", () => {
        if (!isMobileView()) return;
        const isOpen = menu.classList.contains("is-open");
        syncMenuState(!isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (isMobileView()) {
                syncMenuState(false);
            }
        });
    });

    window.addEventListener("resize", () => {
        syncMenuState(false);
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}

function initGallery() {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) return;

    galleryGrid.innerHTML = "";

    galleryImages.forEach((image, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `gallery-item${index === 0 ? " large" : ""}`;
        item.setAttribute("aria-label", `Abrir imagen: ${image.title}`);
        item.addEventListener("click", () => openLightbox(index));

        item.innerHTML = `
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <span class="gallery-overlay">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </span>
            <span class="gallery-icon">
                <i class="fas fa-camera"></i>
            </span>
        `;

        galleryGrid.appendChild(item);
    });
}

function renderLightbox() {
    const image = document.getElementById("lightbox-image");
    const title = document.getElementById("lightbox-title");
    const description = document.getElementById("lightbox-description");
    const counter = document.getElementById("lightbox-counter");

    if (!image || !title || !description || !counter) return;

    image.src = galleryImages[currentImageIndex].url;
    image.alt = galleryImages[currentImageIndex].title;
    title.textContent = galleryImages[currentImageIndex].title;
    description.textContent = galleryImages[currentImageIndex].description;
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(index) {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    currentImageIndex = index;
    renderLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function navigateGallery(direction) {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;

    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    renderLightbox();
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    setupSmoothScroll();
    initGallery();
    updateHeaderOnScroll();
});

window.addEventListener("scroll", updateHeaderOnScroll);

document.addEventListener("keydown", (event) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") navigateGallery(-1);
    if (event.key === "ArrowRight") navigateGallery(1);
});
