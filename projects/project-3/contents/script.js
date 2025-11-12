let baseHue = 180;
let saturation = 70;

function generatePalette() {
    baseHue = Math.floor(Math.random() * 360);
    document.getElementById('hueRange').value = baseHue;
    updatePalette();
}

function updatePalette() {
    baseHue = parseInt(document.getElementById('hueRange').value);
    saturation = parseInt(document.getElementById('saturationRange').value);
    
    const palette = document.getElementById('palette');
    palette.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const hue = (baseHue + (i * 30)) % 360;
        const lightness = 40 + (i * 10);
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        const hex = hslToHex(hue, saturation, lightness);
        
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.background = color;
        colorBox.innerHTML = `<div class="color-code">${hex}</div>`;
        colorBox.onclick = () => copyToClipboard(hex);
        palette.appendChild(colorBox);
    }
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied ${text} to clipboard!`);
    });
}

updatePalette();

