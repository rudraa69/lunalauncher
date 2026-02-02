document.addEventListener('DOMContentLoaded', () => {
    
    // --- STAR GENERATOR (Aesthetic Background) ---
    const bgStars = document.getElementById('bgStars');
    if(bgStars) {
        // Create 50 random stars
        for(let i=0; i<50; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            // Random position
            const left = Math.random() * 100 + 'vw';
            const size = Math.random() * 3 + 2 + 'px'; // 2px to 5px
            const delay = Math.random() * 5 + 's';
            const duration = Math.random() * 10 + 10 + 's'; // 10s to 20s speed
            
            star.style.left = left;
            star.style.width = size;
            star.style.height = size;
            star.style.animationDelay = delay;
            star.style.animationDuration = duration;
            
            bgStars.appendChild(star);
        }
    }

    // --- LOGO PREVIEW LOGIC ---
    const logoInput = document.getElementById('logoInput');
    const logoPreview = document.getElementById('logoPreview');
    const logoUploadBox = document.getElementById('logoUploadBox');

    if(logoInput && logoPreview && logoUploadBox) {
        logoInput.addEventListener('change', function() {
            const file = this.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                    logoUploadBox.classList.add('has-file');
                }
                reader.readAsDataURL(file);
            } else {
                logoUploadBox.classList.remove('has-file');
                logoPreview.src = '';
            }
        });
    }

    // --- STRICT INPUT VALIDATION (SOL Amount) ---
    const poolSolInput = document.getElementById('poolSolInput');
    
    if(poolSolInput) {
        // Prevents typing 'e', '-', '+', etc.
        poolSolInput.addEventListener('keydown', (e) => {
            // Allow: backspace, delete, tab, escape, enter, dot
            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                 // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.ctrlKey === true || e.metaKey === true) || 
                 // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                     return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        // Extra cleanup on input (handles paste)
        poolSolInput.addEventListener('input', function() {
            // Replace anything that is NOT a number or dot
            this.value = this.value.replace(/[^0-9.]/g, '');
            // Prevent multiple dots
            if ((this.value.match(/\./g) || []).length > 1) {
                this.value = this.value.replace(/\.+$/, "");
            }
            calculateTotal();
        });
    }

    // --- SCROLL LOGIC (Hide Navbar) ---
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    if(navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScrollTop && currentScroll > 50) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });
    }

    // --- Pricing & App Logic ---
    const totalDisplay = document.getElementById('totalDisplay');
    const toggleCreator = document.getElementById('toggleCreator');
    const toggleSocials = document.getElementById('toggleSocials');
    const togglePool = document.getElementById('togglePool');
    const sectionCreator = document.getElementById('sectionCreator');
    const sectionSocials = document.getElementById('sectionSocials');
    const sectionPool = document.getElementById('sectionPool');
    const form = document.getElementById('tokenForm');
    const paymentModal = document.getElementById('paymentModal');
    const modalAmount = document.getElementById('modalAmount');
    const closeBtn = document.getElementById('closeModal');
    const copyBtn = document.getElementById('copyBtn');
    const checkTxBtn = document.getElementById('checkTxBtn');
    const statusText = document.getElementById('statusText');
    const walletAddress = document.getElementById('walletAddress');
    
    const priceInputs = document.querySelectorAll('.price-trigger, #toggleCreator, #toggleSocials');
    let baseFee = 0.2;
    let currentFee = 0.2;

    function handleVisibility(toggle, section) {
        if(toggle.checked) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
            if(toggle === togglePool && poolSolInput) {
               poolSolInput.value = ""; 
               calculateTotal();
            }
        }
    }

    if(toggleCreator) toggleCreator.addEventListener('change', () => handleVisibility(toggleCreator, sectionCreator));
    if(toggleSocials) toggleSocials.addEventListener('change', () => handleVisibility(toggleSocials, sectionSocials));
    if(togglePool) togglePool.addEventListener('change', () => {
        handleVisibility(togglePool, sectionPool);
        calculateTotal(); 
    });

    function calculateTotal() {
        let total = baseFee;
        priceInputs.forEach(input => {
            if (input && input.checked) total += 0.1;
        });

        if (togglePool && togglePool.checked && poolSolInput) {
            let poolValue = parseFloat(poolSolInput.value);
            if (!isNaN(poolValue) && poolValue > 0) total += poolValue;
        }

        currentFee = Math.round(total * 1000) / 1000;
        if(totalDisplay) totalDisplay.innerText = currentFee;
    }

    priceInputs.forEach(input => { if(input) input.addEventListener('change', calculateTotal); });

    // --- Form & Modal Logic ---
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            modalAmount.innerText = currentFee;
            statusText.innerText = "";
            paymentModal.style.display = 'flex';
        });
    }

    if(closeBtn) closeBtn.addEventListener('click', () => paymentModal.style.display = 'none');
    if(paymentModal) paymentModal.addEventListener('click', (e) => { if (e.target === paymentModal) paymentModal.style.display = 'none'; });

    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = walletAddress.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = "Copied!";
                copyBtn.style.background = "#00ff9d";
                copyBtn.style.color = "#000";
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.background = "#2a2a35";
                    copyBtn.style.color = "#fff";
                }, 2000);
            });
        });
    }

    if(checkTxBtn) {
        checkTxBtn.addEventListener('click', () => {
            statusText.innerText = "Verifying... Server sync pending. Contact Support if delayed.";
        });
    }

    // --- Wallet Sim ---
    const walletBtn = document.getElementById('walletBtn');
    if(walletBtn) {
        walletBtn.addEventListener('click', () => {
            walletBtn.innerText = "Connecting...";
            setTimeout(() => {
                walletBtn.innerText = "8x92...3k1L";
                walletBtn.style.background = "rgba(109, 87, 255, 0.2)";
                walletBtn.style.border = "1px solid var(--primary)";
            }, 1000);
        });
    }

    // --- FAQ Logic ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });
});