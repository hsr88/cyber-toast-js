# 👾 CyberToast.js

**CyberToast** is a lightweight, zero-dependency JavaScript notification library inspired by Cyberpunk and Sci-Fi aesthetics. It features a unique typewriter effect, glitch animations, and a retro-terminal design.

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Size](https://img.shields.io/badge/size-2kb-blue?style=flat-square)
![Dependencies](https://img.shields.io/badge/dependencies-none-red?style=flat-square)

## 🔗 Demo
👉 **[Live Demo](https://hsr88.github.io/cyber-toast-js/demo/)**
*(Link will work after enabling GitHub Pages)*

## ✨ Features
- **Typewriter Effect:** Text appears character by character like in a terminal.
- **Glitch Animation:** Notifications distort slightly upon entry.
- **Zero Dependencies:** Pure Vanilla JS. No jQuery, no framework required.
- **Auto-Injection:** No need to import a separate CSS file. Styles are injected automatically.
- **Customizable:** Control typing speed, position, and duration.

## 📦 Installation

Just download `src/CyberToast.js` and include it in your project.

```html
<script src="path/to/CyberToast.js"></script>
🚀 UsageInitialize the library once, then call .show() whenever you need a notification.JavaScript// 1. Initialize
const toaster = new CyberToast({
    position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    typingSpeed: 40,       // speed in ms per character
    duration: 4000         // time before auto-dismiss
});

// 2. Show notifications
toaster.show('Access Granted', 'success');
toaster.show('System Failure', 'error');
toaster.show('Downloading...', 'info');
```
## 🎨 Configuration
| Option      	| Type   	| Default     	| Description                            	| 
|-------------	|--------	|-------------	|----------------------------------------	|
| position    	| String 	| 'top-right' 	| Corner to display toasts.              	|
| duration    	| Number 	| 4000        	| How long the toast stays visible (ms). 	| 
| typingSpeed 	| Number 	| 30          	| Speed of the typewriter effect (ms).   	| 

## 👨‍💻 Author

[Krystian Welcel](https://github.com/hsr88)
