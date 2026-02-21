document.addEventListener('DOMContentLoaded', () => {
    // --- 1. MODE SOMBRE ---
    const themeBtn = document.getElementById('theme-switch');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeBtn.innerText = isDark ? "🌙 Sombre" : "☀️ Clair";
        });
    }

    // --- 2. GESTION DU PANIER (Badge) ---
    const updateBadge = () => {
        const cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        const badge = document.getElementById('cart-count');
        if (badge) badge.innerText = cart.length;
    };
    updateBadge();

    // --- 3. EXPOSER LES FONCTIONS AU HTML ---
    window.addToCart = (name, price) => {
        let cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        cart.push({ name, price });
        localStorage.setItem('stt_cart', JSON.stringify(cart));
        updateBadge();

        let toast = document.getElementById('luxury-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'luxury-toast';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.innerText = `${name} a rejoint votre collection.`;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    };

    // --- 5. SYSTÈME DE RÉVÉLATION (DÉPLACÉ ICI) ---
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 100; 
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements(); // On l'exécute une fois au départ
}); // <--- ICI on ferme le DOMContentLoaded

// --- 4. DONNÉES ET MODALES (Peuvent rester dehors car attachées à window) ---
const teaData = {
    'oolong': { title: "Eclipse Oolong", history: "Un thé semi-fermenté aux notes de terre humide.", benefits: "Améliore la concentration." },
    'chai': { title: "Golden Chai", history: "Un mélange d'épices ancestrales.", benefits: "Anti-inflammatoire." },
    'hibiscus': { title: "Crimson Hibiscus", history: "Une infusion écarlate passionnée.", benefits: "Riche en vitamine C." },
    'jasmine': { title: "Golden Jasmine", history: "Fleurs de jasmin cueillies à la lune.", benefits: "Apaise l'esprit." },
    'blacktea': { title: "Imperial Black Tea", history: "Sombre comme une nuit sans étoiles.", benefits: "Énergie durable." },
    'midjasmine': { title: "Midnight Jasmine", history: "Confidences nocturnes.", benefits: "Relaxation profonde." },
    'rooibos': { title: "Mystic Rooibos", history: "Infusion rouge des montagnes.", benefits: "Parfait pour le sommeil." },
    'blueberry': { title: "Royal Blueberry", history: "Baies sauvages pour un goût royal.", benefits: "Antioxydant." },
    'chamomile': { title: "Sacred Chamomile", history: "Paix intérieure millénaire.", benefits: "Contre l'insomnie." },
    'mint': { title: "Velvet Mint", history: "Fraîcheur aristocratique.", benefits: "Facilite la digestion." },
    'jade': { title: "Verdant Jade", history: "Symbole de renouveau.", benefits: "Vitalité." },
    'masala': { title: "Voodoo Masala", history: "Caractère de feu.", benefits: "Combat la fatigue." },
    'peach': { title: "Velvet Peach", history: "Douceur de la pêche.", benefits: "Hydratant." }
};

window.openTea = function(key) {
    const tea = teaData[key];
    const modal = document.getElementById('tea-modal');
    if (tea && modal) {
        document.getElementById('modal-title').innerText = tea.title;
        document.getElementById('modal-history').innerText = tea.history;
        document.getElementById('modal-benefits').innerText = tea.benefits;
        modal.style.display = 'flex';
    }
};

window.closeTea = function() {
    const modal = document.getElementById('tea-modal');
    if (modal) modal.style.display = 'none';
};
