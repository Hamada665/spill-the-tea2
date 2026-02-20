/* ==========================================================================
   PROJECT: Spill The Tea - Interactive Engine (Boutique + Puzzle)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU THÈME (Sombre/Clair) ---
    const themeBtn = document.getElementById('theme-switch');
    const htmlElement = document.documentElement;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            htmlElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeBtn.innerText = isDark ? "🌙 Sombre" : "☀️ Clair";
        });
    }

    // --- 2. SCROLL REVEAL ENGINE ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // --- 3. LOGIQUE DU PUZZLE (Gossip Room) ---
    const puzzleGrid = document.querySelector('.puzzle-grid');
    const secretTextDisplay = document.getElementById('secret-text-display');
    
    if (puzzleGrid && secretTextDisplay) {
        const puzzleData = [
            { id: 1, initial: "Le Testament...", revealed: "Le testament du vieux maître, scellé sous la cire rouge, parlait d'un trésor enfoui non pas en or, mais en parchemins anciens." },
            { id: 2, initial: "L'Ombre de...", revealed: "L'ombre de la Rose Noire, une société secrète disparue, resurgit dans les récits." },
            { id: 3, initial: "La Clé d'Or...", revealed: "La clé d'or, finement ciselée d'un serpent enlacé, n'ouvrait aucune serrure connue." },
            { id: 4, initial: "Sous l'Autel...", revealed: "Sous l'autel brisé de l'ancienne chapelle, un passage secret fut découvert." },
            { id: 5, initial: "Les Étoiles...", revealed: "Les étoiles formaient une carte céleste unique, visible seulement à minuit." },
            { id: 6, initial: "Le Chant...", revealed: "Le chant mélancolique des sirènes était en réalité un code mnémotechnique." },
            { id: 7, initial: "La Dague...", revealed: "La dague de cérémonie portait une inscription invisible sous le clair de lune." },
            { id: 8, initial: "Le Dernier...", revealed: "Le dernier souffle du tyran fut un mot unique, un anagramme de son héritage." },
            { id: 9, initial: "L'Écho du...", revealed: "L'écho du rire d'un enfant annonçait la fin du temps." }
        ];

        let revealedPieces = new Set();
        let typingTimeout;

        function typeSecretText(text) {
            let i = 0;
            secretTextDisplay.textContent = '';
            clearTimeout(typingTimeout);
            function type() {
                if (i < text.length) {
                    secretTextDisplay.textContent += text.charAt(i);
                    i++;
                    typingTimeout = setTimeout(type, 30);
                }
            }
            type();
        }

        puzzleData.forEach(piece => {
            const puzzleDiv = document.createElement('div');
            puzzleDiv.classList.add('puzzle-piece');
            puzzleDiv.innerHTML = `<div class="piece-inner"><div class="piece-front">${piece.initial}</div><div class="piece-back">${piece.revealed}</div></div>`;
            puzzleDiv.addEventListener('click', () => {
                if (!revealedPieces.has(piece.id)) {
                    revealedPieces.add(piece.id);
                    puzzleDiv.classList.add('revealed');
                    const currentSecret = Array.from(revealedPieces).sort((a,b)=>a-b).map(id => puzzleData.find(p=>p.id===id).revealed).join(' ');
                    typeSecretText(currentSecret);
                }
            });
            puzzleGrid.appendChild(puzzleDiv);
        });
    }

    // --- 4. CONFIGURATEUR DE COFFRETS (Boutique) ---
    const teaList = ["Eclipse Oolong", "Golden Chai", "Golden Jasmine", "Imperial Black", "Midnight Jasmine", "Mystic Rooibos", "Royal Blueberry", "Sacred Chamomile", "Velvet Mint", "Verdant Jade", "Voodoo Masala", "Wild Berry", "Zen Matcha"];
    let currentTotal = 0;
    let maxCapacity = 40;

    const boxModal = document.getElementById('box-modal');
    const paymentModal = document.getElementById('payment-modal');

    window.updateQty = function(teaId, change) {
        const display = document.getElementById(`qty-${teaId}`);
        if (!display) return;
        let qty = parseInt(display.innerText);
        if (change > 0 && currentTotal < maxCapacity) { qty++; currentTotal++; }
        else if (change < 0 && qty > 0) { qty--; currentTotal--; }
        display.innerText = qty;
        document.getElementById('current-count').innerText = currentTotal;
        
        const btn = document.getElementById('checkout-box-btn');
        if (btn) {
            btn.disabled = (currentTotal !== maxCapacity);
            btn.innerText = (currentTotal === maxCapacity) ? "Passer au paiement" : `Encore ${maxCapacity - currentTotal} sachets...`;
        }
    };

    document.querySelectorAll('.box-card .btn-luxe').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            currentTotal = 0;
            maxCapacity = (index === 0) ? 40 : 30;
            document.getElementById('max-capacity').innerText = maxCapacity;
            document.getElementById('current-count').innerText = "0";
            document.getElementById('modal-title').innerText = (index === 0) ? "Coffret Héritage (40)" : "Coffret Signature (30)";
            
            const listContainer = document.getElementById('tea-selection-list');
            if (listContainer) {
                listContainer.innerHTML = teaList.map(tea => `
                    <div class="tea-item">
                        <span>${tea}</span>
                        <div class="qty-controls">
                            <button type="button" class="qty-btn" onclick="updateQty('${tea.replace(/\s/g, '')}', -1)">-</button>
                            <span id="qty-${tea.replace(/\s/g, '')}">0</span>
                            <button type="button" class="qty-btn" onclick="updateQty('${tea.replace(/\s/g, '')}', 1)">+</button>
                        </div>
                    </div>
                `).join('');
            }
            if (boxModal) boxModal.style.display = "block";
        });
    });

    document.getElementById('checkout-box-btn')?.addEventListener('click', () => {
        if (boxModal) boxModal.style.display = "none";
        if (paymentModal) paymentModal.style.display = "block";
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            if (boxModal) boxModal.style.display = "none";
            if (paymentModal) paymentModal.style.display = "none";
            const teaModal = document.getElementById('tea-modal');
            if (teaModal) teaModal.style.display = "none";
        };
    });

    // --- 5. LOGIQUE DU PANIER (LocalStorage + Badge) ---
    function updateBadge() {
        const cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.innerText = cart.length;
            badge.style.transform = "scale(1.3)";
            setTimeout(() => badge.style.transform = "scale(1)", 200);
        }
    }

    window.addToCart = function(name, price) {
        let cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        cart.push({ name, price });
        localStorage.setItem('stt_cart', JSON.stringify(cart));
        updateBadge();

        const cartIcon = document.querySelector('.cart-icon-container');
        if(cartIcon) {
            cartIcon.style.backgroundColor = "#27ae60"; 
            setTimeout(() => cartIcon.style.backgroundColor = "", 600);
        }
    };

    updateBadge();

    // Affichage page Panier
    const cartList = document.getElementById('cart-items-list');
    if (cartList) {
        const cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        const emptyMsg = document.getElementById('cart-empty-msg');
        const summary = document.getElementById('cart-summary');
        const totalDisplay = document.getElementById('cart-total-price');

        if (cart.length > 0) {
            if (emptyMsg) emptyMsg.style.display = 'none';
            if (summary) summary.style.display = 'block';
            
            let total = 0;
            cartList.innerHTML = cart.map((item, index) => {
                total += item.price;
                return `
                    <div class="tea-item" style="padding: 15px 0; display:flex; justify-content:space-between; border-bottom:1px solid rgba(212,175,110,0.2);">
                        <span>${item.name}</span>
                        <div>
                            <span style="margin-right: 20px;">${item.price},00 DH</span>
                            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
            if (totalDisplay) totalDisplay.innerText = total;
        }
    }

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('stt_cart', JSON.stringify(cart));
        location.reload();
    };

    document.getElementById('btn-checkout-final')?.addEventListener('click', () => {
        if (paymentModal) paymentModal.style.display = 'block';
    });

    // --- 6. LOGIQUE DE L'HERBIER (Page Parfums) ---
    const teaData = {
        hibiscus: { title: "Midnight Hibiscus", history: "Un secret d'Afrique de l'Ouest, infusé sous la pleine lune.", benefits: "Riche en antioxydants et purifiant." },
        blueberry: { title: "Royal Blueberry", history: "Le favori des cours impériales pour stimuler la vision nocturne.", benefits: "Soutient la mémoire et l'éclat." },
        jasmine: { title: "Golden Jasmine", history: "Récolté à l'aube, il capture l'essence de la discrétion.", benefits: "Déstressant naturel majeur." },
        mint: { title: "Velvet Mint", history: "Une menthe sauvage offrant une fraîcheur aristocratique.", benefits: "Facilite la digestion." },
        blacktea: { title: "Imperial Black Tea", history: "Fermenté dans l'obscurité pour concentrer sa force.", benefits: "Énergie durable et concentration." },
        rooibos: { title: "Mystic Rooibos", history: "Le trésor rouge sans théine des montagnes lointaines.", benefits: "Apaise le système nerveux." },
        oolong: { title: "Eclipse Oolong", history: "Un thé semi-fermenté, à mi-chemin entre l'ombre et la lumière.", benefits: "Booste le métabolisme." },
        chai: { title: "Golden Chai", history: "Un mélange d'épices sacrées pour réchauffer l'âme.", benefits: "Tonifiant et protecteur." },
        matcha: { title: "Zen Matcha", history: "Poudre de jade issue des cérémonies les plus secrètes.", benefits: "Détoxifiant et clarté d'esprit." },
        peach: { title: "Velvet Peach", history: "La douceur de la pêche mariée à la finesse du thé blanc.", benefits: "Hydratation et douceur." },
        masala: { title: "Voodoo Masala", history: "Un thé épicé intense pour réveiller les esprits.", benefits: "Anti-fatigue puissant." },
        chamomile: { title: "Sacred Chamomile", history: "Cueillie dans des jardins secrets pour un repos éternel.", benefits: "Remède ultime contre l'insomnie." },
        jade: { title: "Verdant Jade", history: "Le thé vert le plus pur, frais comme la rosée.", benefits: "Riche en antioxydants." }
    };

    window.openTea = function(key) {
        const tea = teaData[key];
        const modal = document.getElementById('tea-modal');
        if(!tea || !modal) return;
        document.getElementById('modal-title').innerText = tea.title;
        document.getElementById('modal-history').innerText = tea.history;
        document.getElementById('modal-benefits').innerText = tea.benefits;
        modal.style.display = 'flex';
    };

    window.closeTea = function() {
        const modal = document.getElementById('tea-modal');
        if (modal) modal.style.display = 'none';
    };
});
