// Romantic Logic for Marcel & Wioletta Webpage

document.addEventListener('DOMContentLoaded', () => {
    // State management
    const correctPin = '2906';
    let currentInput = '';
    
    // Date of meeting: June 29, 2026
    const startDate = new Date('2026-06-29T00:00:00');
    
    // DOM Elements
    const pinOverlay = document.getElementById('pin-overlay');
    const pinCard = document.querySelector('.pin-card');
    const pinDots = document.querySelectorAll('.pin-dots .dot');
    const pinError = document.getElementById('pin-error');
    const pinButtons = document.querySelectorAll('.pin-btn');
    const mainContent = document.getElementById('main-content');
    
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Check if already unlocked in this session
    if (localStorage.getItem('marcel_wiola_unlocked') === 'true') {
        unlockSite(true); // instant unlock without animation delay
    }

    // --- PIN Pad Logic ---
    pinButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Audio workaround: attempt to activate audio context on any user click
            initAudio();

            const val = btn.getAttribute('data-val');
            
            if (btn.classList.contains('delete-btn')) {
                handleDelete();
            } else if (val !== null && currentInput.length < 4) {
                handleInput(val);
            }
        });
    });

    // Keyboard support for convenience
    document.addEventListener('keydown', (e) => {
        // If site already unlocked, ignore
        if (mainContent.classList.contains('unlocked')) return;
        
        initAudio();
        
        if (e.key >= '0' && e.key <= '9') {
            if (currentInput.length < 4) {
                handleInput(e.key);
            }
        } else if (e.key === 'Backspace') {
            handleDelete();
        }
    });

    function handleInput(digit) {
        currentInput += digit;
        updateDots();
        pinError.classList.remove('visible');
        
        if (currentInput.length === 4) {
            // Check PIN
            setTimeout(() => {
                if (currentInput === correctPin) {
                    unlockSite(false);
                } else {
                    handleWrongPin();
                }
            }, 250);
        }
    }

    function handleDelete() {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDots();
        }
    }

    function updateDots() {
        pinDots.forEach((dot, index) => {
            if (index < currentInput.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function handleWrongPin() {
        // Error animation
        pinCard.classList.add('shake');
        pinError.classList.add('visible');
        
        // Reset dots and input
        currentInput = '';
        setTimeout(() => {
            updateDots();
            pinCard.classList.remove('shake');
        }, 500);
    }

    function unlockSite(instant = false) {
        localStorage.setItem('marcel_wiola_unlocked', 'true');
        
        if (instant) {
            pinOverlay.style.display = 'none';
            mainContent.classList.remove('locked');
            mainContent.classList.add('unlocked');
            startRelationshipCounter();
            startFloatingHearts();
            playMusic();
        } else {
            // Smooth unlock animations
            pinOverlay.classList.add('fade-out');
            
            setTimeout(() => {
                pinOverlay.style.display = 'none';
                mainContent.classList.remove('locked');
                mainContent.classList.add('unlocked');
                startRelationshipCounter();
                startFloatingHearts();
                playMusic();
            }, 800);
        }
    }

    // --- Music Controls ---
    let audioInitialized = false;
    function initAudio() {
        if (audioInitialized) return;
        // Pre-run standard audio context initiation if needed
        audioInitialized = true;
    }

    function playMusic() {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
        }).catch(err => {
            console.log("Autoplay blocked by browser. User needs to toggle music manually or interact further.", err);
        });
    }

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });

    // --- Relationship Counter Logic ---
    function startRelationshipCounter() {
        updateCounter(); // initial call
        setInterval(updateCounter, 1000);
    }

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        
        if (diff < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // --- Floating Hearts Effect ---
    const heartsContainer = document.getElementById('hearts-container');
    
    function startFloatingHearts() {
        // Create initial batch of hearts
        for (let i = 0; i < 8; i++) {
            setTimeout(() => createHeart(), Math.random() * 2000);
        }
        // Continuous spawn
        setInterval(createHeart, 600);
    }

    function createHeart() {
        // If tab is inactive, skip spawning to save performance
        if (document.hidden) return;
        
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Randomize shape (filled heart or outlined heart or variations)
        const heartIcons = [
            '<i class="fa-solid fa-heart"></i>',
            '<i class="fa-solid fa-heart-pulse"></i>',
            '<i class="fa-regular fa-heart"></i>'
        ];
        heart.innerHTML = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        
        // Randomize placement and styling
        const startX = Math.random() * 100; // viewport percentage
        const size = Math.random() * 1.5 + 0.6; // rem
        const duration = Math.random() * 6 + 6; // seconds
        const sway = Math.random() * 40 - 20; // px
        
        heart.style.left = `${startX}vw`;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = `${duration}s`;
        
        // Inject dynamic sway custom property
        heart.style.setProperty('--sway-amount', `${sway}px`);
        
        heartsContainer.appendChild(heart);
        
        // Remove after animation finishes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // --- Lightbox / Gallery Modal ---
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            
            lightboxImg.src = img.src;
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
            closeLightbox();
        }
    });

    // --- Love Letter Logic ---
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const closeLetterBtn = document.getElementById('close-letter-btn');
    
    if (envelopeWrapper && closeLetterBtn) {
        envelopeWrapper.addEventListener('click', (e) => {
            // If the close button was clicked, don't trigger envelope open click
            if (e.target.id === 'close-letter-btn') return;
            
            if (!envelopeWrapper.classList.contains('open')) {
                envelopeWrapper.classList.add('open');
            }
        });
        
        closeLetterBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent envelope wrapper click handler from firing and re-opening
            envelopeWrapper.classList.remove('open');
        });
    }
});
