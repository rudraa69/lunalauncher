// ========================================
// LUNA LAUNCHER - ENHANCED JAVASCRIPT
// Professional Chatbot & Payment Flow
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // STAR GENERATOR - Background Animation
    // ========================================
    const starContainer = document.getElementById('starContainer');
    if(starContainer) {
        for(let i=0; i<80; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            const size = Math.random() * 2.5 + 0.5 + 'px';
            star.style.width = size; 
            star.style.height = size;
            star.style.animationDelay = Math.random() * 5 + 's';
            star.style.animationDuration = (Math.random() * 3 + 3) + 's';
            starContainer.appendChild(star);
        }
    }

    // ========================================
    // NAVBAR - Scroll Behavior & Mobile Menu
    // ========================================
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScrollY = window.scrollY;
    
    if(navbar) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
        });
    }

    // Mobile Menu Toggle
    if(mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ========================================
    // PHANTOM WALLET CONNECTION
    // ========================================
    const walletBtn = document.getElementById('walletBtn');
    if (walletBtn) {
        walletBtn.addEventListener('click', async () => {
            if (!window.solana || !window.solana.isPhantom) {
                alert("⚠️ Phantom Wallet not detected!\n\nPlease install Phantom to continue.");
                window.open("https://phantom.app/", "_blank");
                return;
            }
            try {
                const resp = await window.solana.connect();
                const pubKey = resp.publicKey.toString();
                walletBtn.innerText = pubKey.slice(0, 5) + '...' + pubKey.slice(-5);
                walletBtn.style.border = "2px solid #6d57ff";
                walletBtn.style.background = "rgba(109, 87, 255, 0.2)";
                
                // Show success notification
                showNotification('✅ Wallet Connected Successfully!', 'success');
            } catch (err) {
                console.error('Wallet connection error:', err);
                showNotification('❌ Failed to connect wallet', 'error');
            }
        });
    }

    // ========================================
    // INPUT VALIDATION - Allows Decimals
    // ========================================
    const poolSolInput = document.getElementById('poolSolInput');
    if(poolSolInput) {
        poolSolInput.addEventListener('input', function() {
            // Allow only numbers and single decimal point
            this.value = this.value.replace(/[^0-9.]/g, '');
            if ((this.value.match(/\./g) || []).length > 1) {
                this.value = this.value.replace(/\.+$/, "");
            }
            calculateTotal();
        });
        
        poolSolInput.addEventListener('blur', function() {
            if(this.value && !isNaN(this.value)) {
                this.value = parseFloat(this.value).toFixed(2);
                calculateTotal();
            }
        });
    }

    // ========================================
    // PRICING & RECEIPT LOGIC
    // ========================================
    const totalDisplay = document.getElementById('totalDisplay');
    const togglePool = document.getElementById('togglePool');
    const receiptList = document.getElementById('receiptList');
    const baseFee = 0.2;

    function toggleSection(id, isChecked) {
        const el = document.getElementById(id);
        if(el) {
            if(isChecked) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    }

    function calculateTotal() {
        let total = baseFee;
        let htmlList = ''; 
        
        document.querySelectorAll('.price-trigger').forEach(inp => {
            if(inp.checked) {
                const cost = parseFloat(inp.dataset.cost);
                const name = inp.dataset.name;
                total += cost;
                htmlList += `<div class="receipt-item"><span>${name}</span><span>${cost.toFixed(1)} SOL</span></div>`;
            }
        });

        // Add Liquidity Pool to total
        if (togglePool && togglePool.checked && poolSolInput) {
            let poolValue = parseFloat(poolSolInput.value);
            if (!isNaN(poolValue) && poolValue > 0) {
                total += poolValue;
                htmlList += `<div class="receipt-item"><span>Liquidity Pool</span><span>${poolValue.toFixed(2)} SOL</span></div>`;
            }
        }
        
        if(totalDisplay) totalDisplay.innerText = total.toFixed(2);
        if(receiptList) receiptList.innerHTML = htmlList;
    }

    // Listen to all checkbox changes
    document.querySelectorAll('input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            if(input.id === 'toggleCreator') toggleSection('sectionCreator', input.checked);
            if(input.id === 'toggleSocials') toggleSection('sectionSocials', input.checked);
            if(input.id === 'togglePool') toggleSection('sectionPool', input.checked);
            calculateTotal();
        });
    });

    // ========================================
    // PAYMENT MODAL - Professional Flow
    // ========================================
    const form = document.getElementById('tokenForm');
    const modal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModal');
    const checkTxBtn = document.getElementById('checkTxBtn');
    const statusText = document.getElementById('statusText');
    const walletAddress = document.getElementById('walletAddress');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Update modal amount
            const finalAmount = totalDisplay.innerText;
            document.getElementById('modalAmount').innerText = finalAmount + " SOL";
            
            // Recalculate receipt in case it changed
            calculateTotal();
            
            // Show modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Reset status
            statusText.innerText = "⏳ Waiting for you to send the transaction...";
            statusText.style.color = "var(--text-muted)";
            
            // Re-enable button if it was disabled
            if(checkTxBtn) {
                checkTxBtn.disabled = false;
                checkTxBtn.style.opacity = "1";
                checkTxBtn.style.cursor = "pointer";
            }
            
            // Remove help message if exists
            const existingHelp = document.querySelector('.help-message');
            if(existingHelp) existingHelp.remove();
        });
    }

    // Close modal handlers
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset button state
            if(checkTxBtn) {
                checkTxBtn.disabled = false;
                checkTxBtn.style.opacity = "1";
                checkTxBtn.style.cursor = "pointer";
            }
            
            // Remove help message if exists
            const existingHelp = document.querySelector('.help-message');
            if(existingHelp) existingHelp.remove();
        });
    }
    
    if(modal) {
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset button state
                if(checkTxBtn) {
                    checkTxBtn.disabled = false;
                    checkTxBtn.style.opacity = "1";
                    checkTxBtn.style.cursor = "pointer";
                }
                
                // Remove help message if exists
                const existingHelp = document.querySelector('.help-message');
                if(existingHelp) existingHelp.remove();
            }
        });
    }
    
    // Copy wallet address
    if(walletAddress) {
        walletAddress.addEventListener('click', () => {
            const address = walletAddress.innerText;
            navigator.clipboard.writeText(address).then(() => {
                const originalColor = walletAddress.style.borderColor;
                const originalBg = walletAddress.style.background;
                
                walletAddress.style.borderColor = "#00ff9d";
                walletAddress.style.background = "rgba(0, 255, 157, 0.1)";
                
                showNotification('📋 Address copied to clipboard!', 'success');
                
                setTimeout(() => {
                    walletAddress.style.borderColor = originalColor;
                    walletAddress.style.background = originalBg;
                }, 600);
            }).catch(err => {
                console.error('Copy failed:', err);
                showNotification('❌ Failed to copy address', 'error');
            });
        });
    }

    // Check transaction button - Enhanced with proper flow
    if(checkTxBtn) {
        checkTxBtn.addEventListener('click', () => {
            const statusArea = document.getElementById('statusArea');
            
            // Step 1: Initial verification
            statusText.innerText = "🔍 Verifying transaction on Solana blockchain...";
            statusText.style.color = "#ffcc00";
            checkTxBtn.disabled = true;
            checkTxBtn.style.opacity = "0.6";
            checkTxBtn.style.cursor = "not-allowed";
            
            // Step 2: Checking blockchain (simulate API call)
            setTimeout(() => {
                statusText.innerText = "⏳ Scanning mempool for your transaction...";
                statusText.style.color = "#ffcc00";
            }, 1500);
            
            // Step 3: Still processing
            setTimeout(() => {
                statusText.innerText = "🔄 Payment verification in progress. Please wait...";
                statusText.style.color = "#ffcc00";
            }, 3500);
            
            // Step 4: Final status (this is demo - in production, would verify actual transaction)
            setTimeout(() => {
                statusText.innerText = "⏱️ Transaction pending. This may take 30-60 seconds.";
                statusText.style.color = "var(--warning)";
                
                // Add additional help message
                const helpMsg = document.createElement('p');
                helpMsg.style.cssText = `
                    font-size: 0.85rem; 
                    color: #999; 
                    margin-top: 15px; 
                    line-height: 1.6;
                    text-align: center;
                    background: rgba(255, 204, 0, 0.05);
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 204, 0, 0.2);
                `;
                helpMsg.innerHTML = `
                    <strong style="color: var(--warning);">⚠️ Still waiting?</strong><br>
                    • Check your wallet for transaction status<br>
                    • If SOL was deducted, your token is being created<br>
                    • If stuck, contact <a href="https://discord.com/invite/lunalaunch" target="_blank" style="color: var(--primary); text-decoration: underline;">Support</a> or use chatbot 💬
                `;
                
                // Only add if not already added
                if(!statusArea.querySelector('.help-message')) {
                    helpMsg.className = 'help-message';
                    statusArea.parentElement.insertBefore(helpMsg, checkTxBtn);
                }
                
            }, 6000);
        });
    }

    // ========================================
    // LOGO UPLOAD PREVIEW
    // ========================================
    const logoInput = document.getElementById('logoInput');
    const logoPreview = document.getElementById('logoPreview');
    const logoBox = document.getElementById('logoUploadBox');
    
    if(logoInput && logoPreview && logoBox) {
        logoInput.addEventListener('change', function() {
            const file = this.files[0];
            if(file) {
                // Validate file type
                if(!file.type.match('image.*')) {
                    showNotification('❌ Please upload an image file', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if(file.size > 5 * 1024 * 1024) {
                    showNotification('❌ Image must be less than 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    logoPreview.src = e.target.result;
                    logoBox.classList.add('has-file');
                    showNotification('✅ Logo uploaded successfully', 'success');
                }
                reader.readAsDataURL(file);
            }
        });
        
        // Drag and drop support
        logoBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            logoBox.style.borderColor = 'var(--primary)';
            logoBox.style.background = 'rgba(109, 87, 255, 0.1)';
        });
        
        logoBox.addEventListener('dragleave', () => {
            logoBox.style.borderColor = '';
            logoBox.style.background = '';
        });
        
        logoBox.addEventListener('drop', (e) => {
            e.preventDefault();
            logoBox.style.borderColor = '';
            logoBox.style.background = '';
            
            const file = e.dataTransfer.files[0];
            if(file) {
                logoInput.files = e.dataTransfer.files;
                logoInput.dispatchEvent(new Event('change'));
            }
        });
    }

    // ========================================
    // FAQ ACCORDION - Smooth Animation
    // ========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item.active').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.style.padding = "0 30px";
                    otherAnswer.style.opacity = "0";
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
            
            if (!isActive) {
                // Opening
                answer.style.maxHeight = answer.scrollHeight + 60 + "px";
                answer.style.padding = "20px 30px 30px";
                answer.style.opacity = "1";
            } else {
                // Closing
                answer.style.maxHeight = null;
                answer.style.padding = "0 30px";
                answer.style.opacity = "0";
            }
        });
    });

    // ========================================
    // PROFESSIONAL CHATBOT
    // ========================================
    const chatBtn = document.getElementById('toggleChat');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatBody = document.getElementById('chatBody');

    // Chatbot Knowledge Base
    const chatbotKnowledge = {
        greeting: {
            responses: [
                "👋 Welcome to Luna Launch! I'm your AI assistant. How can I help you today?",
                "Hi there! 🌙 Ready to launch your Solana token? I'm here to guide you!"
            ]
        },
        payment: {
            question: "I need help with payment",
            answer: `💳 <strong>Payment Instructions:</strong><br><br>
            1. <strong>Base Fee:</strong> 0.2 SOL (required)<br>
            2. Select any optional features you want<br>
            3. Click "Create Token" to see final amount<br>
            4. Send EXACT amount to the provided address<br>
            5. Click "I Sent the SOL" to verify<br><br>
            ⚠️ <strong>Important:</strong> Always send the exact amount shown. Incorrect amounts may delay processing.<br><br>
            If your payment is stuck, check the transaction on <a href="https://solscan.io" target="_blank" style="color:#a29dff">Solscan</a>. Need more help? Join our <a href="https://discord.com/invite/lunalaunch" target="_blank" style="color:#a29dff">Discord</a>.`
        },
        glitch: {
            question: "Report a technical issue",
            answer: `🐛 <strong>Reporting Technical Issues:</strong><br><br>
            To report a bug or glitch:<br><br>
            1. Take a screenshot of the issue<br>
            2. Note what you were trying to do<br>
            3. Share your browser & device info<br>
            4. Post in our <a href="https://discord.com/invite/lunalaunch" target="_blank" style="color:#a29dff">Discord Bug Report</a> channel<br><br>
            Our dev team monitors reports 24/7 and typically responds within 1-2 hours.`
        },
        launch: {
            question: "How do I launch a token?",
            answer: `🚀 <strong>Token Launch Guide:</strong><br><br>
            <strong>Step 1:</strong> Connect your Phantom Wallet<br>
            <strong>Step 2:</strong> Fill in token details (name, symbol, supply)<br>
            <strong>Step 3:</strong> Upload your token logo (optional)<br>
            <strong>Step 4:</strong> Select optional features (revoke authorities, liquidity pool, etc.)<br>
            <strong>Step 5:</strong> Review total cost and click "Create Token"<br>
            <strong>Step 6:</strong> Send SOL to the provided address<br>
            <strong>Step 7:</strong> Confirm payment and receive your token!<br><br>
            ⏱️ <strong>Total Time:</strong> 2-5 minutes<br>
            💰 <strong>Base Cost:</strong> 0.2 SOL`
        },
        features: {
            question: "What features are available?",
            answer: `✨ <strong>Luna Launch Features:</strong><br><br>
            <strong>Standard Features:</strong><br>
            • Custom token name & symbol<br>
            • Flexible supply & decimals<br>
            • Logo upload & metadata<br>
            • Creator info & social links<br><br>
            <strong>Security Features (+0.1 SOL each):</strong><br>
            • Revoke Freeze Authority<br>
            • Revoke Mint Authority<br>
            • Revoke Update Authority<br><br>
            <strong>Premium Features:</strong><br>
            • 🚀 Raydium Fast-Track (+0.5 SOL)<br>
            • 🛡️ Anti-Rug Certificate (+0.8 SOL)<br>
            • 💎 Diamond Hands Mode (+0.4 SOL)<br><br>
            All features are optional. Base fee is just 0.2 SOL!`
        },
        wallet: {
            question: "Wallet & Phantom help",
            answer: `👛 <strong>Phantom Wallet Guide:</strong><br><br>
            <strong>Don't have Phantom?</strong><br>
            1. Visit <a href="https://phantom.app" target="_blank" style="color:#a29dff">phantom.app</a><br>
            2. Download browser extension or mobile app<br>
            3. Create new wallet or import existing<br>
            4. Fund with SOL from an exchange<br><br>
            <strong>Connection Issues?</strong><br>
            • Refresh the page<br>
            • Make sure Phantom is unlocked<br>
            • Try disconnecting & reconnecting<br>
            • Check browser permissions<br><br>
            Need SOL? Buy on <a href="https://www.coinbase.com" target="_blank" style="color:#a29dff">Coinbase</a> or <a href="https://www.binance.com" target="_blank" style="color:#a29dff">Binance</a>.`
        },
        security: {
            question: "Is Luna Launch safe?",
            answer: `🛡️ <strong>Security & Safety:</strong><br><br>
            <strong>Yes! Luna Launch is secure:</strong><br><br>
            ✅ Audited smart contracts<br>
            ✅ No access to your private keys<br>
            ✅ Transparent on-chain operations<br>
            ✅ 12,400+ tokens launched safely<br>
            ✅ $45M+ in liquidity locked<br><br>
            <strong>Best Practices:</strong><br>
            • Never share your seed phrase<br>
            • Always verify transaction amounts<br>
            • Use official Luna Launch links only<br>
            • Enable Phantom security features<br><br>
            Your funds are safe with us! 🔐`
        },
        cost: {
            question: "How much does it cost?",
            answer: `💰 <strong>Pricing Breakdown:</strong><br><br>
            <strong>Base Fee:</strong> 0.2 SOL (required)<br>
            Includes: Token creation, metadata, basic features<br><br>
            <strong>Optional Upgrades:</strong><br>
            • Creator Info: +0.1 SOL<br>
            • Social Links: +0.1 SOL<br>
            • Revoke Freeze: +0.1 SOL<br>
            • Revoke Mint: +0.1 SOL<br>
            • Revoke Update: +0.1 SOL<br>
            • Fast-Track: +0.5 SOL<br>
            • Anti-Rug Cert: +0.8 SOL<br>
            • Diamond Hands: +0.4 SOL<br><br>
            <strong>Liquidity Pool:</strong> FREE to create<br>
            (You just provide the SOL/tokens for the pool)<br><br>
            Most users spend 0.2 - 1.0 SOL total.`
        }
    };

    // Toggle chat window
    if(chatBtn && chatWindow) {
        chatBtn.addEventListener('click', () => {
            const isOpen = chatWindow.style.display === 'flex';
            chatWindow.style.display = isOpen ? 'none' : 'flex';
            
            if(!isOpen) {
                // Scroll to bottom when opening
                setTimeout(() => {
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 100);
            }
        });
    }

    if(closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });
    }

    // Handle chat option clicks
    window.handleChatOption = function(option) {
        // Remove existing options
        const existingOptions = chatBody.querySelector('.chat-options');
        if(existingOptions) existingOptions.remove();
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg msg-user';
        
        let knowledgeKey = option;
        let responseData;
        
        switch(option) {
            case 'payment':
                userMsg.innerText = "I need help with payment";
                responseData = chatbotKnowledge.payment;
                break;
            case 'glitch':
                userMsg.innerText = "Report a technical issue";
                responseData = chatbotKnowledge.glitch;
                break;
            case 'launch':
                userMsg.innerText = "How do I launch a token?";
                responseData = chatbotKnowledge.launch;
                break;
            case 'features':
                userMsg.innerText = "What features are available?";
                responseData = chatbotKnowledge.features;
                break;
            case 'wallet':
                userMsg.innerText = "Wallet & Phantom help";
                responseData = chatbotKnowledge.wallet;
                break;
            case 'security':
                userMsg.innerText = "Is Luna Launch safe?";
                responseData = chatbotKnowledge.security;
                break;
            case 'cost':
                userMsg.innerText = "How much does it cost?";
                responseData = chatbotKnowledge.cost;
                break;
            default:
                userMsg.innerText = option;
                responseData = { answer: "I'm not sure about that. Please try another option or join our Discord for support!" };
        }

        chatBody.appendChild(userMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Add bot response after delay
        setTimeout(() => {
            typingIndicator.remove();
            
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg msg-bot';
            botMsg.innerHTML = responseData.answer;
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Add follow-up options
            setTimeout(() => {
                addFollowUpOptions();
            }, 500);
        }, 1200);
    };

    // Add follow-up options
    function addFollowUpOptions() {
        const followUpDiv = document.createElement('div');
        followUpDiv.className = 'chat-options';
        followUpDiv.innerHTML = `
            <button class="chat-opt-btn" onclick="handleChatOption('features')">📋 Features</button>
            <button class="chat-opt-btn" onclick="handleChatOption('cost')">💰 Pricing</button>
            <button class="chat-opt-btn" onclick="handleChatOption('wallet')">👛 Wallet Help</button>
            <button class="chat-opt-btn" onclick="handleChatOption('security')">🛡️ Security</button>
        `;
        chatBody.appendChild(followUpDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existing = document.querySelector('.notification-toast');
        if(existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00ff9d, #00cc7d)' : 
                         type === 'error' ? 'linear-gradient(135deg, #ff4444, #cc0000)' : 
                         'linear-gradient(135deg, #6d57ff, #d946ef)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 600;
            font-size: 0.95rem;
            animation: slideInRight 0.4s ease;
            max-width: 350px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Add notification animations to document
    if(!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // INITIALIZE ON LOAD
    // ========================================
    calculateTotal(); // Initialize pricing
    
    console.log('%c🌙 Luna Launch', 'font-size: 24px; font-weight: bold; color: #6d57ff;');
    console.log('%c✨ Production-Grade Solana Token Launcher', 'font-size: 14px; color: #9ca3af;');
    console.log('%c🚀 Ready to launch!', 'font-size: 12px; color: #00ff9d;');
});
