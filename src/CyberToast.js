class CyberToast {
    /**
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Default configuration
        this.options = {
            position: 'top-right', // Locations: top-right, top-left, bottom-right, bottom-left
            duration: 4000,        // Time in ms before auto-dismiss
            typingSpeed: 30,       // Speed of the typewriter effect (ms per char)
            ...options             // Merge user options
        };

        // Initialize the DOM elements and styles
        this.initContainer();
        this.injectStyles();
    }

    // Creates the main container for toasts if it doesn't exist
    initContainer() {
        const containerId = `cyber-toast-container-${this.options.position}`;
        
        // Check if container already exists to avoid duplicates
        if (!document.getElementById(containerId)) {
            const container = document.createElement('div');
            container.id = containerId;
            container.className = `cyber-toast-container ${this.options.position}`;
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.getElementById(containerId);
        }
    }

    // Injects the necessary CSS into the document head
    // This allows the library to be "zero-dependency" (no external .css file needed)
    injectStyles() {
        if (document.getElementById('cyber-toast-styles')) return;

        const css = `
            /* --- Toast Container --- */
            .cyber-toast-container {
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 15px;
                pointer-events: none; /* Allows clicking through the empty container */
                font-family: 'Courier New', Courier, monospace;
            }

            /* Positioning logic */
            .cyber-toast-container.top-right { top: 30px; right: 30px; }
            .cyber-toast-container.bottom-right { bottom: 30px; right: 30px; }
            .cyber-toast-container.top-left { top: 30px; left: 30px; }
            .cyber-toast-container.bottom-left { bottom: 30px; left: 30px; }

            /* --- Main Toast Style --- */
            .cyber-toast {
                min-width: 300px;
                max-width: 400px;
                padding: 20px;
                background: rgba(10, 10, 15, 0.95); /* Deep dark background */
                border: 1px solid;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                position: relative;
                pointer-events: auto; /* Re-enable clicks on the toast itself */
                cursor: pointer;
                box-shadow: 0 0 15px rgba(0,0,0,0.5);
                
                /* Hidden state for animation */
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.3s, transform 0.3s;
                
                /* CRT Monitor Scanline effect */
                background-image: 
                    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                background-size: 100% 2px, 3px 100%;
            }

            /* Sci-Fi Corner Cut effect */
            .cyber-toast::after {
                content: '';
                position: absolute;
                bottom: -1px;
                right: -1px;
                width: 15px;
                height: 15px;
                background: #000; /* Matches body background */
                border-top: 1px solid;
                border-left: 1px solid;
                border-color: inherit;
            }

            /* Themes */
            .cyber-toast.success { 
                border-color: #00ff41; 
                color: #00ff41;
                box-shadow: 0 0 10px rgba(0, 255, 65, 0.2); 
            }
            .cyber-toast.error { 
                border-color: #ff0055; 
                color: #ff0055;
                box-shadow: 0 0 10px rgba(255, 0, 85, 0.2);
            }
            .cyber-toast.info { 
                border-color: #00d9ff; 
                color: #00d9ff;
                box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
            }

            /* Visible State */
            .cyber-toast.visible {
                opacity: 1;
                transform: translateX(0);
                animation: glitch-anim 0.3s ease-out; /* Trigger glitch on entry */
            }

            /* Blinking Cursor */
            .cursor {
                display: inline-block;
                width: 8px;
                height: 14px;
                background-color: currentColor;
                animation: blink 1s infinite;
                vertical-align: middle;
                margin-left: 5px;
            }

            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            
            /* Glitch Animation Keyframes */
            @keyframes glitch-anim {
                0% { transform: translateX(50px) skewX(0deg); }
                20% { transform: translateX(-10px) skewX(-10deg); }
                40% { transform: translateX(5px) skewX(5deg); }
                60% { transform: translateX(-2px) skewX(0deg); }
                100% { transform: translateX(0); }
            }
        `;

        const style = document.createElement('style');
        style.id = 'cyber-toast-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    /**
     * Displays a notification
     * @param {string} message - The text to display
     * @param {string} type - 'success', 'error', or 'info'
     */
    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `cyber-toast ${type}`;
        
        // Determine header based on message type
        const header = type === 'error' ? '[CRITICAL ERROR]' : '[SYSTEM MESSAGE]';
        
        // Set up HTML structure with empty span for typewriter effect
        toast.innerHTML = `
            <div style="font-size: 0.7em; opacity: 0.7; margin-bottom: 5px;">${header}</div>
            <span class="text-content"></span><span class="cursor"></span>
        `;

        this.container.appendChild(toast);
        
        // Force reflow to enable CSS transition (browser hack)
        void toast.offsetWidth; 
        
        // Make visible (triggers CSS transition and glitch animation)
        toast.classList.add('visible');

        // Start the typewriter logic
        this.typewriterEffect(toast.querySelector('.text-content'), message);

        // Calculate total time: base duration + time needed to type the message
        const totalDuration = this.options.duration + (message.length * this.options.typingSpeed);

        // Auto-dismiss logic
        setTimeout(() => {
            this.dismiss(toast);
        }, totalDuration);

        // Allow manual dismissal on click
        toast.onclick = () => this.dismiss(toast);
    }

    // Simulates typing by adding characters one by one
    typewriterEffect(element, text) {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i > text.length - 1) {
                clearInterval(interval);
            }
        }, this.options.typingSpeed);
    }

    // Removes the toast with an exit animation
    dismiss(toastElement) {
        // Trigger CSS exit state
        toastElement.classList.remove('visible');
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateX(20px)';
        
        // Wait for transition to finish before removing from DOM
        setTimeout(() => {
            if(toastElement.parentElement) toastElement.remove();
        }, 300);
    }
}