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

// --- 7. GESTION DES COFFRETS PERSONNALISÉS ---
let currentBoxLimit = 0;
let currentSelectionCount = 0;

window.openBox = (boxName) => {
    const modal = document.getElementById('tea-modal');
    const selectionList = document.getElementById('tea-selection-list');
    
    // Définir la limite selon la boîte choisie
    currentBoxLimit = (boxName === 'Coffret Héritage') ? 40 : 30;
    currentSelectionCount = 0;

    if (modal && selectionList) {
        document.getElementById('modal-title').innerText = "Personnaliser votre " + boxName;
        
        // On affiche le compteur dynamique dans modal-history
        document.getElementById('modal-history').innerHTML = 
            `Remplissez votre écrin : <b id="box-counter">0</b> / ${currentBoxLimit} sachets`;
        
        // On vide la liste précédente
        selectionList.innerHTML = ''; 

        // On génère les thés à partir de teaData
        Object.keys(teaData).forEach(key => {
            const tea = teaData[key];
            const teaRow = document.createElement('div');
            teaRow.style = "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(255,255,255,0.1); align-items:center;";

            teaRow.innerHTML = `
                <span style="font-family:'Playfair Display'; color:var(--text-color);">${tea.title}</span>
                <div style="display:flex; gap:15px; align-items:center;">
                    <button onclick="changeQty('${key}', -1)" style="width:30px; height:30px; border-radius:50%; border:1px solid var(--accent-gold); background:none; color:var(--accent-gold); cursor:pointer;">-</button>
                    <span id="qty-${key}" style="font-weight:bold; min-width:20px; text-align:center;">0</span>
                    <button onclick="changeQty('${key}', 1)" style="width:30px; height:30px; border-radius:50%; background:var(--accent-gold); border:none; color:var(--primary-bg); cursor:pointer; font-weight:bold;">+</button>
                </div>
            `;
            selectionList.appendChild(teaRow);
        });

        // Mise à jour de la zone de bouton
        const price = (boxName === 'Coffret Héritage') ? 250 : 120;
        document.getElementById('modal-benefits').innerHTML = `
            <div id="limit-warning" style="color:#ff4d4d; font-size:0.9rem; margin-bottom:10px; display:none; text-align:center;">Limite de ${currentBoxLimit} sachets atteinte !</div>
            <button id="pay-box-btn" class="btn-luxe" style="width:100%; padding:15px;" onclick="processBoxPayment('${boxName}', ${price})">
                Payer le coffret (${price},00 DH)
            </button>
        `;

        modal.style.display = 'flex';
    }
};

window.changeQty = (key, delta) => {
    const qtySpan = document.getElementById(`qty-${key}`);
    const counterDisplay = document.getElementById('box-counter');
    const warning = document.getElementById('limit-warning');
    
    let itemQty = parseInt(qtySpan.innerText);

    // Blocage si limite atteinte
    if (delta > 0 && currentSelectionCount >= currentBoxLimit) {
        warning.style.display = 'block';
        return;
    }

    // Calcul de la nouvelle quantité
    if (delta < 0 && itemQty > 0) {
        itemQty--;
        currentSelectionCount--;
    } else if (delta > 0) {
        itemQty++;
        currentSelectionCount++;
    }

    // Affichage
    qtySpan.innerText = itemQty;
    counterDisplay.innerText = currentSelectionCount;
    if (currentSelectionCount < currentBoxLimit) warning.style.display = 'none';
};

window.processBoxPayment = (name, price) => {
    if (currentSelectionCount === 0) {
        alert("Veuillez ajouter au moins un sachet à votre coffret.");
        return;
    }
    // 1. Ajouter au panier
    addToCart(name, price);
    // 2. Fermer la sélection
    closeTea();
    // 3. Ouvrir le paiement
    setTimeout(() => {
        document.getElementById('payment-modal').style.display = 'flex';
    }, 300);
};

// --- 8. GOSSIP ROOM ENGINE (Version Robuste pour l'Oral) ---

// Base de données interne
const gossipDatabase = {
    "STT-ECLIPSE": { id: 1, text: "La baronne n'était pas au gala ce soir-là...", user: "TeaLover212" },
    "STT-GOLDEN": { id: 2, text: "Elle a été vue près des serres avec un inconnu.", user: "MysteryHunter" },
    "STT-JASMINE": { id: 3, text: "Un flacon de poison vide a été retrouvé.", user: "DetectiveTea" },
    "STT-ROOIBOS": { id: 4, text: "Le testament avait été modifié le matin même.", user: "SecretFinder" },
    "STT-CHAI": { id: 5, text: "Les caméras ont été coupées à 23h04 précisément.", user: "GhostProtocol" },
    "STT-MINT": { id: 6, text: "Son mari n'est pas le véritable héritier du domaine.", user: "Spiller_01" },
    "STT-JADE": { id: 7, text: "La lettre cachée contient un aveu de trahison.", user: "NightOwl" },
    "STT-VOODOO": { id: 8, text: "La tasse de thé sur le bureau était encore brûlante.", user: "MasterBrewer" }
};

// FORCE l'accès global pour le bouton HTML
window.checkCode = function() {
    console.log("Tentative d'infusion du code..."); // Pour vérifier dans la console
    const input = document.getElementById('secret-code');
    const feedback = document.getElementById('feedback-msg');
    
    if (!input) {
        console.error("Erreur : L'élément 'secret-code' est introuvable dans le HTML.");
        return;
    }

    const code = input.value.trim().toUpperCase();
    const data = gossipDatabase[code];

    if (data) {
        const card = document.getElementById(`frag-${data.id}`);
        
        if (card && card.classList.contains('locked')) {
            // Révélation
            card.classList.remove('locked');
            card.classList.add('revealed');
            card.querySelector('.fragment-text').innerText = `"${data.text}"`;
            
            const userTag = document.createElement('span');
            userTag.style = "font-size: 0.6rem; color: var(--accent-gold); margin-top: 10px; display: block;";
            userTag.innerText = `Révélé par ${data.user}`;
            card.appendChild(userTag);

            // Notification via ton Toast existant
            let toast = document.getElementById('luxury-toast');
            if (toast) {
                toast.innerText = "Fragment infusé ! La vérité progresse.";
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }

            feedback.innerText = "Code accepté. Le secret s'infuse...";
            feedback.style.color = "#27ae60";
            updateGossipProgress();
        } else {
            feedback.innerText = "Ce fragment est déjà connu de la communauté.";
            feedback.style.color = "orange";
        }
    } else {
        feedback.innerText = "Code invalide. Essayez STT-ECLIPSE pour tester.";
        feedback.style.color = "#ff4d4d";
    }
    input.value = ''; 
};

function updateGossipProgress() {
    const revealedCount = document.querySelectorAll('.fragment-card.revealed').length;
    const progressPercent = (revealedCount / 8) * 100;

    const bar = document.getElementById('progress-bar');
    const text = document.getElementById('progress-text');
    
    if (bar) bar.style.width = `${progressPercent}%`;
    if (text) text.innerText = `${revealedCount} / 8 fragments infusés`;

    if (revealedCount === 8) {
        const revealArea = document.getElementById('reveal-area');
        if (revealArea) {
            revealArea.innerHTML = `
                <div style="animation: fadeInUp 1s ease-out; padding: 20px;">
                    <span class="badge-brewed">✓ GOSSIP FULLY BREWED</span>
                    <h2 class="luxury-serif">Vérité Révélée</h2>
                    <p>Le mystère de l'Héritage Interdit a été résolu.</p>
                </div>`;
        }
    }
}
