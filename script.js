// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500); // Show for 1.5 seconds
    }
});

// Custom Cursor
const cursor = document.getElementById('cursor');
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor movement
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .blog-post, .project-card, .chess-square, .side-image');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Add hover class to dynamically loaded elements
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
                const newHoverElements = node.querySelectorAll ? node.querySelectorAll('a, button, .blog-post, .project-card') : [];
                newHoverElements.forEach(element => {
                    element.addEventListener('mouseenter', () => {
                        cursor.classList.add('hover');
                    });
                    element.addEventListener('mouseleave', () => {
                        cursor.classList.remove('hover');
                    });
                });
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

