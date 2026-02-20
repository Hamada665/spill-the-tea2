/* ==========================================================================
   PROJECT: Spill The Tea - Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU THÈME (Sombre/Clair) ---
    const themeBtn = document.getElementById('theme-switch');
    const htmlElement = document.documentElement;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                themeBtn.innerText = "🌙 Sombre";
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                themeBtn.innerText = "☀️ Clair";
            }
        });
    }

    // --- 2. SCROLL REVEAL ENGINE (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // On arrête d'observer une fois l'élément révélé pour la performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // On cible tous les éléments à révéler
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
