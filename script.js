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

    // --- 2. GESTION DU BADGE PANIER ---
    const updateBadge = () => {
        const cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        const badge = document.getElementById('cart-count');
        if (badge) badge.innerText = cart.length;
    };
    updateBadge();

    // --- 3. FONCTION AJOUTER AU PANIER ---
    window.addToCart = (name, price) => {
        let cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        cart.push({ name, price });
        localStorage.setItem('stt_cart', JSON.stringify(cart));
        updateBadge();

        // Notification Toast
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

    // --- 4. RÉVÉLATION AU SCROLL ---
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealElements);
    revealElements();

    // --- 5. MOTEUR DU PANIER (NOUVEAU) ---
    const renderCart = () => {
        const cartContainer = document.getElementById('cart-items-list');
        const emptyMsg = document.getElementById('cart-empty-msg');
        const summary = document.getElementById('cart-summary');
        const totalPriceEl = document.getElementById('cart-total-price');

        if (!cartContainer) return; 

        const cart = JSON.parse(localStorage.getItem('stt_cart')) || [];

        if (cart.length === 0) {
            emptyMsg.style.display = 'block';
            summary.style.display = 'none';
            cartContainer.innerHTML = '';
            return;
        }

        emptyMsg.style.display = 'none';
        summary.style.display = 'block';

        let total = 0;
        cartContainer.innerHTML = ''; 

        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'tea-item'; 
            div.innerHTML = `
                <div style="text-align: left;">
                    <strong class="luxury-serif" style="color: var(--accent-gold);">${item.name}</strong>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${item.price},00 DH</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.8rem; font-family:'Poppins';">Supprimer</button>
            `;
            cartContainer.appendChild(div);
        });

        totalPriceEl.innerText = total;
    };

    // Charger le panier si on est sur la page panier
    renderCart();

    // Fonction supprimer (accessible globalement)
    window.removeFromCart = (index) => {
        let cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('stt_cart', JSON.stringify(cart));
        renderCart();
        updateBadge();
    };

    // Bouton de paiement final
    const checkoutBtn = document.getElementById('btn-checkout-final');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            document.getElementById('payment-modal').style.display = 'flex';
        });
    }
});

// --- 6. DONNÉES DE L'HERBIER (Hors du DOMContent pour les boutons onclick) ---
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

// --- 7. GESTION DES COFFRETS PERSONNALISÉS (VERSION MISE À JOUR) ---
window.openBox = (boxName) => {
    const modal = document.getElementById('tea-modal');
    const selectionList = document.getElementById('tea-selection-list');
    
    if (modal && selectionList) {
        // 1. Mise à jour des textes
        document.getElementById('modal-title').innerText = "Personnaliser votre " + boxName;
        document.getElementById('modal-history').innerText = "Composez votre assortiment (max 10 sachets).";
        
        // 2. Vider la liste avant de la générer
        selectionList.innerHTML = ''; 

        // 3. Générer la liste des thés à partir de teaData (Section 6 de ton code)
        Object.keys(teaData).forEach(key => {
            const tea = teaData[key];
            const teaRow = document.createElement('div');
            teaRow.className = 'tea-item-select'; // On crée une ligne pour chaque thé
            teaRow.style.display = 'flex';
            teaRow.style.justifyContent = 'space-between';
            teaRow.style.padding = '10px';
            teaRow.style.borderBottom = '1px solid #333';

            teaRow.innerHTML = `
                <span>${tea.title}</span>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button onclick="changeQty('${key}', -1)" style="width:25px; cursor:pointer;">-</button>
                    <span id="qty-${key}">0</span>
                    <button onclick="changeQty('${key}', 1)" style="width:25px; cursor:pointer;">+</button>
                </div>
            `;
            selectionList.appendChild(teaRow);
        });

        // 4. Ajouter le bouton de validation
        const price = (boxName === 'Coffret Héritage') ? 250 : 120;
        document.getElementById('modal-benefits').innerHTML = `
            <button class="btn-luxe" style="width:100%; margin-top:15px;" onclick="addToCart('${boxName}', ${price}); closeTea();">
                Ajouter ce coffret (${price},00 DH)
            </button>
        `;

        modal.style.display = 'flex';
    }
};

// Fonctions utilitaires pour les boutons + et -
window.changeQty = (key, delta) => {
    const qtySpan = document.getElementById(`qty-${key}`);
    if (qtySpan) {
        let currentQty = parseInt(qtySpan.innerText);
        currentQty = Math.max(0, currentQty + delta); // Pas de négatif
        qtySpan.innerText = currentQty;
    }
};
