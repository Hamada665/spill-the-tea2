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
        let qty = parseInt(display.innerText);
        if (change > 0 && currentTotal < maxCapacity) { qty++; currentTotal++; }
        else if (change < 0 && qty > 0) { qty--; currentTotal--; }
        display.innerText = qty;
        document.getElementById('current-count').innerText = currentTotal;
        
        const btn = document.getElementById('checkout-box-btn');
        btn.disabled = (currentTotal !== maxCapacity);
        btn.innerText = (currentTotal === maxCapacity) ? "Passer au paiement" : `Encore ${maxCapacity - currentTotal} sachets...`;
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
            boxModal.style.display = "block";
        });
    });

    document.getElementById('checkout-box-btn')?.addEventListener('click', () => {
        boxModal.style.display = "none";
        paymentModal.style.display = "block";
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.onclick = () => {
            boxModal.style.display = "none";
            paymentModal.style.display = "none";
        };
    });
});
