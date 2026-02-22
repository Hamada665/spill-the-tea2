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

    // --- 5. MOTEUR DU PANIER ---

// --- 5. MOTEUR DU PANIER ---
    window.renderCart = () => {
        const cartContainer = document.getElementById('cart-items-list');
        const emptyMsg = document.getElementById('cart-empty-msg');
        const summary = document.getElementById('cart-summary');
        const totalPriceEl = document.getElementById('cart-total-price');

        if (!cartContainer) return;
        const cart = JSON.parse(localStorage.getItem('stt_cart')) || [];

        if (cart.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            if (summary) summary.style.display = 'none';
            cartContainer.innerHTML = '';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';
        if (summary) summary.style.display = 'block';

        let total = 0;
        cartContainer.innerHTML = '';
        cart.forEach((item, index) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'tea-item';
            div.style = "display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(212,175,110,0.2);";
            div.innerHTML = `
                <div style="text-align: left;">
                    <strong class="luxury-serif" style="color: var(--accent-gold);">${item.name}</strong>
                    <p style="font-size: 0.8rem; margin:0;">${item.price},00 DH</p>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:0.8rem;">Supprimer</button>
            `;
            cartContainer.appendChild(div);
        });
        if (totalPriceEl) totalPriceEl.innerText = total;
    };

    window.removeFromCart = (index) => {
        let cart = JSON.parse(localStorage.getItem('stt_cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('stt_cart', JSON.stringify(cart));
        window.renderCart();
        updateBadge();
    };

    // Lancer le rendu au chargement
    window.renderCart();
    
    // Bouton de paiement final (C'EST ICI QUE ÇA CHANGE)
    const checkoutBtn = document.getElementById('btn-checkout-final');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const paymentModal = document.getElementById('payment-modal');
            if (paymentModal) {
                paymentModal.style.display = 'flex';
                
                // On cible le bouton de confirmation DANS la modale de paiement
                const confirmPaymentBtn = paymentModal.querySelector('.btn-luxe'); 
                if (confirmPaymentBtn) {
                    confirmPaymentBtn.onclick = (e) => {
                        e.preventDefault(); 
                        
                        // 1. Fermer le formulaire de paiement
                        paymentModal.style.display = 'none';
                        
                        // 2. Vider le panier
                        localStorage.removeItem('stt_cart');
                        updateBadge();
                        if(typeof renderCart === "function") renderCart(); // Rafraîchit l'affichage du panier vide
                        
                        // 3. Afficher la superbe alerte de luxe
                        showLuxuryAlert(
                            "Demande Transmise", 
                            "Votre sélection a été enregistrée avec discrétion. Nos agents vous contacteront sous 24h pour finaliser le rituel."
                        );
                    };
                }
            }
        });
    }
}); // <--- BIEN VÉRIFIER QUE CETTE ACCOLADE FERME LE DOMContentLoaded

// --- 5.5 DONNÉES DE LA GAZETTE (BLOG) ---
const blogData = {
    1: {
        title: "L'infusion était-elle empoisonnée ?",
        content: `
            <p style="color:var(--accent-gold); font-weight:bold; margin-bottom:10px;">L'AFFAIRE DES CAVENDISH</p>
            <p>Le soir du 14 février, la baronne Cavendish s'est effondrée après une seule gorgée de son thé noir préféré. Les enquêteurs ont trouvé des traces d'une herbe rare non répertoriée dans le sachet...</p>
            <p style="margin-top:15px;">Était-ce un accident d'herboriste ou un acte prémédité ? Un fragment de son testament a été retrouvé brûlé dans la cheminée. Les membres de la Gossip Room qui possèdent la collection "Hiver Noir" ont déjà commencé à recouper les indices.</p>
        `
    },
    2: {
        title: "Ce que votre tasse dit de vos secrets",
        content: `
            <p>Une femme qui boit son thé sans sucre cache souvent une vérité amère. Le thé blanc, quant à lui, est le secret des nuits de complots : riche en antioxydants, il efface les cernes des plus grandes stratèges.</p>
            <p style="margin-top:15px;">Apprenez à lire dans les feuilles de thé de vos rivales. Une feuille qui flotte verticalement ? Une visite inattendue. Trois feuilles au fond ? Une trahison imminente. Restez radieuse, même dans le mystère.</p>
        `
    },
    3: {
        title: "Comment les indices sont-ils cachés ?",
        content: `
            <p>Dans nos ateliers, la discrétion est la règle d'or. Chaque boîte de thé "Spill The Tea" contient un compartiment secret que seuls les plus observateurs trouveront.</p>
            <p style="margin-top:15px;">Nos artisans utilisent une encre invisible qui ne se révèle qu'à la chaleur de la vapeur de votre tasse. C'est ainsi que nous scellons les potins les plus brûlants de la haute société. Ne jetez jamais votre emballage avant d'avoir tout exploré.</p>
        `
    }
};

// --- 6. DONNÉES DE L'HERBIER (Hors du DOMContent pour les boutons onclick) ---
const teaData = {
    'oolong': { title: "Eclipse Oolong", history: "L'Eclipse Oolong est un thé de clair-obscur, né d'une oxydation partielle qui capture l'instant précis où le jour rencontre la nuit. Ses feuilles froissées racontent l'histoire des montagnes brumeuses du Fujian, où le thé est flétri sous la lumière argentée de la lune. On dit qu'il était servi lors des banquets secrets pour délier les langues et révéler les vérités cachées.", benefits: "Véritable élixir d'équilibre, ce Oolong est riche en polyphénols. Il stimule le métabolisme et favorise la clarté mentale, offrant l'énergie d'un thé noir et la douceur protectrice d'un thé vert. Parfait pour une concentration intense ou pour apaiser l'esprit après une journée agitée." },
    'chai': { title: "Golden Chai", history: "Inspiré des recettes sacrées des bazars de Jaipur, le Golden Chai est une infusion solaire où le feu des épices rencontre la douceur liquide du miel sauvage. Chaque tasse est une promesse de chaleur, un héritage de traditions où le gingembre et la cardamome étaient broyés au mortier pour chasser les ombres de l'hiver. C'est l'élixir des hospitalités généreuses et des secrets partagés au coin du feu.", benefits: "Un puissant allié pour le corps : les épices activent la circulation et facilitent la digestion, tandis que les notes de miel apaisent la gorge et l'esprit. Naturellement anti-inflammatoire et réconfortant, il renforce les défenses naturelles et procure une sensation de bien-être immédiat, comme une étreinte pour l'âme." },
    'hibiscus': { title: "Crimson Hibiscus", history: "Le Crimson Hibiscus est une célébration de l'éclat. Surnommé 'l'or rouge' des jardins d'Afrique de l'Ouest, il offre une infusion couleur rubis, intense et effrontée. Chaque calice séché au soleil capture l'énergie pure de l'été. Dans les cours royales, on le buvait glacé pour rafraîchir les idées lors des négociations intenses ou chaud pour célébrer le renouveau. C'est le parfum de ceux qui osent briller.", benefits: "Une explosion de vitalité. Naturellement sans théine et gorgé de vitamine C, le Crimson Hibiscus est un puissant allié contre l'oxydation. Il aide à réguler la tension, favorise la circulation et offre un effet drainant précieux. Sa saveur acidulée réveille les papilles et purifie l'organisme, laissant une sensation de fraîcheur absolue.." },
    'jasmine': { title: "Golden Jasmine", history: "Le Golden Jasmine est le fruit d'un mariage nocturne. Ses feuilles de thé vert sont délicatement parfumées au contact de fleurs de jasmin fraîchement écloses, cueillies à la main à l'heure où leur parfum est le plus envoûtant. Dans les jardins secrets d'Orient, cette infusion était le symbole d'une beauté éternelle et d'un esprit serein. Chaque tasse exhale un bouquet floral précieux qui semble suspendre le temps.", benefits: "Surnommé 'le baume de l'esprit', le Golden Jasmine agit comme un déstressant naturel immédiat. Riche en antioxydants grâce au thé vert, il aide à apaiser les tensions nerveuses et à lutter contre les radicaux libres. Sa fragrance subtile stimule la production d'endorphines, offrant une sensation de légèreté et de clarté mentale, idéale après une longue journée." },
    'blacktea': { title: "Imperial Black Tea", history: "Héritier des cargaisons précieuses qui traversaient les continents, l'Imperial Black Tea est un monument de force et de noblesse. Ses feuilles, fermentées jusqu'à atteindre la couleur de l'onyx, révèlent des notes boisées et légèrement maltées. C'était autrefois le compagnon des philosophes et des souverains, capable de maintenir l'esprit vif lors des longues veillées de décision. C'est le thé de ceux qui commandent à leur propre destin.", benefits: "Un véritable condensé d'énergie. Grâce à sa haute teneur en théine et en théaflavines, il améliore la vigilance et la concentration sans l'effet de nervosité du café. Il favorise la santé cardiovasculaire et stimule le système immunitaire. Une tasse d'Imperial Black Tea agit comme un bouclier protecteur et un moteur de productivité pour toute la journée." },
    'midjasmine': { title: "Midnight Jasmine", history: "Le Midnight Jasmine est une confidence murmurée à la lueur des étoiles. À la base florale et sacrée du jasmin de nuit s'ajoute l'éclat vif et velouté de la framboise sauvage. Cette alliance audacieuse a été créée pour capturer l'essence d'une promenade nocturne dans un jardin interdit, où la douceur des fleurs se mêle à l'acidité gourmande des baies cachées. C'est une infusion de contrastes, faite pour ceux qui préfèrent l'ombre à la lumière.", benefits: "Une potion double action pour le corps et l'esprit. Le jasmin apaise le système nerveux et libère les tensions, tandis que la framboise apporte une dose précieuse d'antioxydants et de vitamine C. Ce mélange aide à raviver l'éclat du teint et à apaiser l'anxiété. Une tasse de Midnight Jasmine est une invitation au lâcher-prise total, tout en protégeant vos cellules des agressions extérieures." },
    'rooibos': { title: "Mystic Rooibos", history: "Le Mystic Rooibos puise sa force dans les terres rouges et arides d'Afrique du Sud. Surnommé 'le buisson de feu', il n'est pas un thé, mais une infusion ancestrale dont les secrets de récolte se transmettent de génération en génération. Sous son apparence boisée et sa robe cuivrée, il cache des notes naturellement sucrées et vanillées. C'est l'infusion du calme après la tempête, un hommage à la terre qui respire sous le soleil brûlant.", benefits: "Naturellement sans théine, le Mystic Rooibos est le compagnon idéal de vos soirées. Riche en minéraux (zinc, magnésium, potassium) et en antioxydants rares comme l'aspalathine, il aide à apaiser les troubles digestifs et les allergies cutanées. C'est une boisson hautement régénératrice qui favorise un sommeil profond et réparateur tout en luttant contre le vieillissement cellulaire." },
    'blueberry': { title: "Royal Blueberry", history: "Le Royal Blueberry est une ode à la gourmandise aristocratique. Mariant la profondeur d'un thé noir d'exception à l'éclat sucré et légèrement acidulé des bleuets sauvages, ce mélange évoque les jardins d'été des domaines royaux. Chaque gorgée est une explosion de velours fruité, conçue pour transformer une simple pause en un moment de haute distinction. C'est le parfum des plaisirs assumés et de l'élégance décontractée.", benefits: "Un véritable bouclier de jeunesse. Les bleuets sont parmi les fruits les plus riches en anthocyanes, de puissants antioxydants qui protègent la vision et boostent les fonctions cognitives. Associés aux vertus tonifiantes du thé, ils aident à lutter contre la fatigue oculaire et le stress oxydatif. C'est l'infusion idéale pour ceux qui travaillent l'esprit, offrant protection et clarté à chaque tasse." },
    'chamomile': { title: "Sacred Chamomile", history: "La Sacred Chamomile est l'héritière des remèdes de l'Égypte ancienne, où elle était vénérée comme une offrande au Dieu Soleil pour son pouvoir de guérison. Nos fleurs de camomille matricaire sont récoltées avec respect, préservant leurs cœurs dorés intacts. Ce n'est pas une simple tisane, mais un rituel de passage entre l'agitation du monde et le calme de la nuit. Elle est la gardienne des rêves et le sceau final de toute journée bien remplie.", benefits: "Véritable sédatif naturel, la camomille contient de l'apigénine, un antioxydant qui favorise la relaxation musculaire et réduit l'anxiété. Elle est reconnue pour ses vertus apaisantes sur le système digestif et sa capacité à préparer le corps à un sommeil profond et sans interruption. Une tasse de Sacred Chamomile est une invitation à poser ses bagages et à laisser la paix s'installer." },
    'mint': { title: "Velvet Mint", history: "Le Velvet Mint est une caresse de fraîcheur sur un lit de soie. Contrairement aux menthes poivrées ordinaires, ce mélange utilise une variété de menthe douce sélectionnée pour sa texture presque crémeuse en bouche. Inspiré par les jardins suspendus où l'air est toujours pur, ce parfum évoque la rosée du matin sur les feuilles vertes. C'est l'infusion de la clarté retrouvée, un souffle d'air frais dans le tumulte du quotidien.", benefits: "Une panacée pour le confort intérieur. Le Velvet Mint est célèbre pour ses propriétés antispasmodiques qui facilitent instantanément la digestion et apaisent les maux de tête liés au stress. Sa haute concentration en menthol naturel aide à dégager les voies respiratoires et procure une sensation de légèreté incroyable. C'est le digestif noble par excellence, idéal pour conclure un repas sur une note de pureté." },
    'jade': { title: "Verdant Jade", history: "Le Verdant Jade est une immersion au cœur des plantations d'altitude, là où la terre et le ciel se confondent. Ce thé vert d'exception est récolté au tout début du printemps, lorsque les bourgeons sont encore gorgés de la sève nouvelle. Son nom rend hommage à sa couleur émeraude et à sa pureté minérale. Dans les traditions anciennes, le Jade était la pierre de l'immortalité ; ce thé en est la version liquide, un secret de longévité précieusement gardé par les maîtres de thé.", benefits: "Concentré pur de catéchines et de L-théanine, le Verdant Jade est le maître de la détoxication. Il aide à purifier l'organisme en éliminant les toxines tout en stimulant doucement le métabolisme. C'est un puissant protecteur cellulaire qui améliore l'aspect de la peau et renforce le système immunitaire. Contrairement au café, il offre une énergie calme et une vigilance sereine, idéale pour une séance de méditation ou de travail créatif." },
    'masala': { title: "Voodoo Masala", history: "Le Voodoo Masala est une potion envoûtante née de l'union entre la force brute du thé noir et un mélange secret d'épices torréfiées. Inspiré par l'énergie mystique des rituels ancestraux, ce thé libère des effluves de poivre noir, de clou de girofle et de cannelle sauvage. C'est une infusion de caractère, conçue pour ceux qui n'ont pas peur de l'intensité et qui cherchent à briser la routine. Une seule gorgée suffit pour se sentir transporté dans un voyage sensoriel sans retour.", benefits: "Un véritable coup de fouet pour l'organisme. Le Voodoo Masala possède des propriétés thermogéniques puissantes qui stimulent le métabolisme et facilitent la digestion. Les épices, riches en composés actifs, agissent comme des stimulants naturels pour le système immunitaire et aident à combattre la fatigue physique et mentale. C'est l'élixir idéal pour rallumer le feu intérieur et retrouver une vitalité débordante lors des journées les plus exigeantes." },
    'peach': { title: "Velvet Peach", history: "Le Velvet Peach est un hommage à la douceur de vivre. Imaginez la peau veloutée d'une pêche mûrie sous le soleil de Provence, dont le jus sucré vient infuser un thé blanc d'une finesse extrême. Ce mélange a été conçu comme une caresse, un instant suspendu dans un verger au crépuscule. C'est le parfum de la légèreté et de l'insouciance, une infusion qui transforme chaque gorgée en une bouchée de fruit défendu, à la fois tendre et rayonnante.", benefits: "Une véritable cure de douceur pour votre peau et votre esprit. Le thé blanc, base de ce mélange, est le moins transformé des thés, préservant ainsi un taux record d'antioxydants régénérateurs. Associé aux extraits de pêche riches en vitamines, il favorise l'hydratation des tissus et apporte un éclat naturel au teint. C'est l'infusion 'beauté' par excellence, idéale pour se faire du bien tout en savourant un moment de pur délice fruité." }
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
    showLuxuryAlert("Écrin Vide", "Veuillez choisir quelques secrets à glisser dans votre coffret avant de continuer.");
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

// --- 8. GOSSIP ROOM ENGINE (VERSION FINALE AVEC BOUTON SPILL) ---

const gossipDatabase = {
    "STT-ECLIPSE": { id: 1, text: "La baronne n'était pas au gala ce soir-là..." },
    "STT-GOLDEN": { id: 2, text: "Elle a été vue près des serres avec un inconnu." },
    "STT-JASMINE": { id: 3, text: "Un flacon de poison vide a été retrouvé." },
    "STT-ROOIBOS": { id: 4, text: "Le testament avait été modifié le matin même." },
    "STT-CHAI": { id: 5, text: "Les caméras ont été coupées à 23h04 précisément." },
    "STT-MINT": { id: 6, text: "Son mari n'est pas le véritable héritier du domaine." },
    "STT-JADE": { id: 7, text: "La lettre cachée contient un aveu de trahison." },
    "STT-VOODOO": { id: 8, text: "La tasse de thé sur le bureau était encore brûlante." }
};

window.checkCode = function() {
    const input = document.getElementById('secret-code');
    const feedback = document.getElementById('feedback-msg');
    const code = input.value.trim().toUpperCase();
    const data = gossipDatabase[code];

    if (data) {
        const card = document.getElementById(`frag-${data.id}`);
        if (card && card.classList.contains('locked')) {
            card.classList.remove('locked');
            card.classList.add('revealed');
            card.querySelector('.fragment-text').innerText = `"${data.text}"`;
            feedback.innerText = "Fragment débloqué !";
            feedback.style.color = "#27ae60";
            
            // ON FORCE LA MISE À JOUR ICI
            runGossipUpdate(); 
        }
    } else {
        feedback.innerText = "Code invalide.";
        feedback.style.color = "#ff4d4d";
    }
    input.value = "";
};

function runGossipUpdate() {
    const revealed = document.querySelectorAll('.fragment-card.revealed').length;
    const bar = document.getElementById('progress-bar');
    const progText = document.getElementById('progress-text');
    
    // Mise à jour visuelle immédiate
    if (bar) bar.style.width = (revealed / 8 * 100) + "%";
    if (progText) progText.innerText = `${revealed} / 8 fragments infusés`;

    console.log("Progression : " + revealed + "/8");

    // SI LE COMPTE EST BON (8/8)
    if (revealed === 8) {
        console.log("Lancement du bouquet final !");
        const revealArea = document.getElementById('reveal-area');
        if (revealArea) {
            revealArea.style.border = "2px solid var(--accent-gold)";
            revealArea.innerHTML = `
                <div style="padding: 20px; text-align:center; animation: fadeInUp 1s forwards;">
                    <h3 class="luxury-serif" style="margin-bottom:15px;">Félicitations, Détective.</h3>
                    <button class="btn-luxe" onclick="showFullStory()" style="box-shadow: 0 0 20px #d4af6e;">
                        🍵 SPILL THE TEA
                    </button>
                </div>
            `;
        }
    }
}

window.showFullStory = function() {
    const revealArea = document.getElementById('reveal-area');
    revealArea.innerHTML = `
        <div class="full-gossip-reveal" style="animation: fadeInUp 1s forwards; text-align: left; padding: 30px; border: 1px solid var(--accent-gold); background: rgba(0,0,0,0.5); border-radius:12px;">
            <h2 class="luxury-serif" style="color:var(--accent-gold); text-align:center;">L'Héritage Interdit : La Vérité</h2>
            <p style="margin-top:20px; line-height:1.8;">Franchement, tu ne vas jamais croire ce qui se passe en ce moment, l’ambiance est devenue tellement bizarre que même les gens qui ne remarquent jamais rien commencent à poser des questions. Depuis quelques jours, tout le monde chuchote comme s’il y avait un secret énorme qui flottait dans l’air, et apparemment tout aurait commencé après cette fameuse soirée où Lina est partie plus tôt sans prévenir personne. Certains disent qu’elle avait l’air stressée, d’autres jurent qu’elle souriait en regardant son téléphone comme si elle attendait un message précis. Le plus étrange, c’est que Samir semblait déjà savoir quelque chose avant tout le monde, mais il fait semblant de ne rien comprendre quand on lui pose des questions. Hier matin, quelqu’un a même remarqué qu’ils évitaient de se croiser du regard, ce qui est vraiment inhabituel vu qu’ils parlaient tout le temps avant. Puis il y a cette histoire du petit paquet mystérieux apparu sur son bureau, sans nom, sans mot, juste posé là comme si quelqu’un voulait qu’on le remarque sans être vu. Évidemment, ça a déclenché mille théories différentes, certains parlent d’une relation secrète, d’autres pensent à une dispute cachée, et quelques-uns sont persuadés que tout ça est lié à quelque chose de bien plus sérieux. Depuis, Lina est devenue super discrète, elle parle moins, elle part plus tôt, et elle regarde autour d’elle comme si elle avait peur qu’on découvre quelque chose. Même ceux qui ne croient jamais aux rumeurs commencent à admettre qu’il se passe vraiment quelque chose d’étrange. Honnêtement, on dirait le calme juste avant un énorme scandale, et tout le monde attend le moment où quelqu’un va enfin dire la vérité. Parce qu’à ce rythme, c’est sûr, ça ne va pas rester secret très longtemps.</p>
            <center><button class="btn-luxe-small" onclick="location.reload()" style="margin-top:20px;">Fermer les archives</button></center>
        </div>
    `;
    revealArea.scrollIntoView({ behavior: 'smooth' });
};

// --- 9. SYSTÈME D'ALERTE DE LUXE ---
window.showLuxuryAlert = (title, message) => {
    const modal = document.getElementById('custom-alert');
    const titleEl = document.getElementById('alert-title');
    const msgEl = document.getElementById('alert-message');
    
    if (modal && titleEl && msgEl) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        modal.style.display = 'flex';
        // Petit délai pour l'animation CSS
        setTimeout(() => { modal.classList.add('active'); }, 10);
    }
};

window.closeAlert = () => {
    const modal = document.getElementById('custom-alert');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 400);
    }
};

// --- 10. GESTION MODALE GAZETTE (BLOG) ---
window.openBlog = function(id) {
    const modal = document.getElementById('blog-modal');
    const container = document.getElementById('modal-body-content');
    const data = blogData[id];

    if (modal && data) {
        container.innerHTML = `
            <h2 class="luxury-serif" style="font-size:2.2rem; color:var(--accent-gold); margin-bottom:20px;">${data.title}</h2>
            <div style="line-height:1.8; font-family:'Poppins'; font-weight:300; color:var(--text-main);">${data.content}</div>
        `;
        modal.style.display = 'flex';
        // Ajout d'un léger flou en arrière-plan pour le luxe
        document.body.style.overflow = 'hidden'; // Empêche le scroll
    }
};

// Fonction pour fermer la modale blog
window.closeBlog = function() {
    const modal = document.getElementById('blog-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Réactive le scroll
    }
};

// Fermer si on clique en dehors du contenu
window.addEventListener('click', (event) => {
    const modal = document.getElementById('blog-modal');
    if (event.target == modal) {
        closeBlog();
    }
});
