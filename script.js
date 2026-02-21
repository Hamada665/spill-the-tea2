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
        alert(`${name} a été ajouté au panier !`);
    };
});

// --- 4. DONNÉES DE L'HERBIER (Tes 12 Thés) ---
const teaData = {
    'oolong': { title: "Eclipse Oolong", history: "Un thé semi-fermenté aux notes de terre humide et de mystère.", benefits: "Améliore la concentration et booste le métabolisme." },
    'chai': { title: "Golden Chai", history: "Un mélange d'épices ancestrales utilisé pour réchauffer les cœurs solitaires.", benefits: "Anti-inflammatoire et tonifiant naturel." },
    'hibiscus': {title: "Crimson Hibisus",history: "Une infusion écarlate dont la recette fut dérobée dans les jardins suspendus d'une cité oubliée. Sa couleur rouge sang n'est pas une coïncidence : elle représente la passion et les serments que l'on ne peut briser.",benefits: "Infusion tonifiante, riche en vitamine C et idéale pour réguler la tension." },
    'jasmine': { title: "Golden Jasmine", history: "Des fleurs de jasmin cueillies à la main sous le premier croissant de lune.", benefits: "Réduit le stress et apaise l'esprit." },
    'blacktea': { title: "Imperial Black Tea", history: "Le thé des empereurs, sombre comme une nuit sans étoiles.", benefits: "Énergie durable et clarté mentale." },
    'midjasmine': { title: "Midnight Jasmine", history: "Une variante plus intense du jasmin pour les confidences nocturnes.", benefits: "Aide à la relaxation profonde." },
    'rooibos': { title: "Mystic Rooibos", history: "Une infusion rouge sans théine provenant des montagnes lointaines.", benefits: "Riche en minéraux et parfait pour le sommeil." },
    'blueberry': { title: "Royal Blueberry", history: "Des baies sauvages infusées pour un goût royal et sucré.", benefits: "Puissant antioxydant pour la peau." },
    'chamomile': { title: "Sacred Chamomile", history: "Utilisée depuis des millénaires pour sceller la paix intérieure.", benefits: "Remède naturel contre l'insomnie." },
    'mint': { title: "Velvet Mint", history: "Une menthe douce qui laisse un voile de fraîcheur aristocratique.", benefits: "Facilite la digestion après un festin." },
    'jade': { title: "Verdant Jade", history: "Le thé vert le plus pur, symbole de renouveau et de vitalité.", benefits: "Détoxifie l'organisme en profondeur." },
    'masala': { title: "Voodoo Masala", history: "Un thé épicé aux pouvoirs envoûtants et au caractère de feu.", benefits: "Réveille les sens et combat la fatigue." },
    'peach': { title: "Velvet Peach", history: "La douceur de la pêche mariée à la délicatesse des feuilles de thé.", benefits: "Hydratant et riche en vitamines." }
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

// --- 5. SYSTÈME DE RÉVÉLATION AU SCROLL ---
const revealElements = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 150; // Distance avant apparition

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

// On lance la fonction au scroll et au chargement
window.addEventListener('scroll', revealElements);
revealElements();
