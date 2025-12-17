document.addEventListener('DOMContentLoaded', () => {
    // --- Web Audio API Initialization ---
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    let hasInteracted = false; 
    let hoverListenersAttached = false; 

    const initAudioContext = () => {
        if (!audioCtx) {
            audioCtx = new AudioContext();
            hasInteracted = true;
            attachHoverListeners(); 
            document.removeEventListener('mousedown', initAudioContext, true);
            document.removeEventListener('click', initAudioContext, true);
        }
    };
    
    document.addEventListener('mousedown', initAudioContext, true);
    document.addEventListener('click', initAudioContext, true);


    // --- 1. CLICK SOUND: Crisp Pop ---
    const playClickTone = () => {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, now);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        oscillator.start(now);
        oscillator.stop(now + 0.08);
    };
    
    // --- 2. HOVER SOUND: High-Tech "Tick" (Much better than before) ---
    const playHoverTone = () => {
        if (!audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        // Using Sine wave at high frequency for a clean "tick"
        oscillator.type = 'sine'; 
        oscillator.frequency.setValueAtTime(1200, now); 
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.05, now + 0.002); // Very quiet
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03); // Very short

        oscillator.start(now);
        oscillator.stop(now + 0.03);
    };

    // --- 3. SLIDE SOUND: Subtle Whoosh for Hero Banner ---
    const playSlideTone = () => {
        if (!audioCtx || !hasInteracted) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        oscillator.type = 'sine';
        // Pitch drop effect
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    }

    // --- Listeners ---
    const attachHoverListeners = () => {
        if (hoverListenersAttached) return;
        const interactiveElements = document.querySelectorAll('a, button, .logo-link');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', (event) => {
                if (hasInteracted && !element.classList.contains('disabled')) {
                    playHoverTone();
                }
            });
        });
        hoverListenersAttached = true;
    }

    document.body.addEventListener('mousedown', (event) => {
        const target = event.target.closest('a, button, .logo-link');
        if (target && !target.classList.contains('disabled')) {
            playClickTone();
        }
    });


    // --- Hero Section Logic ---
    const heroSection = document.getElementById('hero-section');
    const heroContent = document.querySelector('.hero-content'); 
    if (!heroSection || !heroContent) return;

    // Game Data (Updated for Crush Connect)
    const games = [
        { 
            name: "FLAPPY NAIN", 
            desc: "The hyper-casual game of precision and patience.", 
            pcLink: "game-wrapper.html?src=games/flappynain/pc/index.html", 
            mobileLink: "game-wrapper.html?src=games/flappynain/mobile/index.html", 
            banner: "images/flappynainbanner.png" 
        },
        { 
            name: "SNAKE LAND", 
            desc: "The classic arcade challenge. Can you conquer the land?", 
            pcLink: "game-wrapper.html?src=games/snakeland/pc/index.html", 
            mobileLink: null, 
            banner: "images/snakelandbanner.png" 
        },
        { 
            name: "TIC TAC TOE", 
            desc: "Challenge friends or the AI in this timeless puzzle.", 
            pcLink: "game-wrapper.html?src=games/tictactae/pc/index.html", 
            mobileLink: "game-wrapper.html?src=games/tictactae/mobile/index.html", 
            banner: "images/tictactaebanner.png" 
        },
        { 
            name: "CRUSH CONNECT", 
            desc: "Link matching items in this addictive puzzle saga.", 
            pcLink: "game-wrapper.html?src=games/crushconnect/pc/index.html", 
            mobileLink: "game-wrapper.html?src=games/crushconnect/mobile/index.html", 
            banner: "images/crushconnectbanner.png" 
        }
    ];

    let currentIndex = 0;
    const heroTitle = document.getElementById('hero-game-name');
    const heroDesc = document.getElementById('hero-game-desc');
    const heroPcLink = document.getElementById('hero-pc-link');
    const heroMobileLink = document.getElementById('hero-mobile-link');

    function updateHero(index, isInitialLoad = false) { 
        const game = games[index];

        if (!isInitialLoad) {
            heroContent.classList.add('fade-out');
            heroSection.classList.add('fade-out');
            playSlideTone(); // Play sound on slide change
        }

        setTimeout(() => {
            heroTitle.textContent = game.name;
            heroDesc.textContent = game.desc;
            heroPcLink.href = game.pcLink;
            
            heroSection.style.backgroundImage = `url(${game.banner})`;

            if (game.mobileLink) {
                heroMobileLink.style.display = 'inline-block';
                heroMobileLink.href = game.mobileLink;
                heroMobileLink.classList.remove('disabled');
                heroMobileLink.textContent = 'Play on Android';
            } else {
                heroMobileLink.style.display = 'none';
            }
            
            heroSection.classList.remove('fade-out');
            heroContent.classList.remove('fade-out');
            
        }, isInitialLoad ? 0 : 500); 
    }

    updateHero(currentIndex, true); 
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % games.length;
        updateHero(currentIndex);
    }, 8000);
});