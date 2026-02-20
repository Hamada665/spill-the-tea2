/* ==========================================================================
   PROJECT: Spill The Tea - Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
   // --- 3. LOGIQUE DU PUZZLE (Gossip Room) ---
    const puzzleGrid = document.querySelector('.puzzle-grid');
    const secretTextDisplay = document.getElementById('secret-text-display');
    
    // On ne lance la logique que si on est sur la page Gossip Room
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
            puzzleDiv.dataset.id = piece.id;
            puzzleDiv.innerHTML = `
                <div class="piece-inner">
                    <div class="piece-front">${piece.initial}</div>
                    <div class="piece-back">${piece.revealed}</div>
                </div>
            `;

            puzzleDiv.addEventListener('click', () => {
                if (!revealedPieces.has(piece.id)) {
                    revealedPieces.add(piece.id);
                    puzzleDiv.classList.add('revealed');

                    // On trie et on assemble le secret
                    const currentSecret = Array.from(revealedPieces)
                        .sort((a, b) => a - b)
                        .map(id => puzzleData.find(p => p.id === id).revealed)
                        .join(' ');

                    typeSecretText(currentSecret);
                }
            });
            puzzleGrid.appendChild(puzzleDiv);
        });
    }
    
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

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        // L'image bouge un peu plus lentement pour créer la profondeur
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
});
