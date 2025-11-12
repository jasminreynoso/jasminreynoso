let currentColor = '#000000';
let gridSize = 16;
let isDrawing = false;

function init() {
    document.getElementById('colorPicker').addEventListener('input', (e) => {
        currentColor = e.target.value;
    });
    createGrid();
}

function createGrid() {
    gridSize = parseInt(document.getElementById('gridSize').value) || 16;
    const grid = document.getElementById('pixelGrid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    const pixelSize = Math.min(600 / gridSize, 30);
    grid.style.width = `${pixelSize * gridSize}px`;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.addEventListener('click', () => {
            pixel.style.background = currentColor;
        });
        pixel.addEventListener('mousedown', (e) => {
            isDrawing = true;
            pixel.style.background = currentColor;
        });
        pixel.addEventListener('mouseenter', () => {
            if (isDrawing) {
                pixel.style.background = currentColor;
            }
        });
        grid.appendChild(pixel);
    }
}

document.addEventListener('mouseup', () => {
    isDrawing = false;
});

function fillCanvas() {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
        pixel.style.background = currentColor;
    });
}

function clearCanvas() {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
        pixel.style.background = 'white';
    });
}

function saveCanvas() {
    const grid = document.getElementById('pixelGrid');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const pixels = document.querySelectorAll('.pixel');
    
    canvas.width = gridSize;
    canvas.height = gridSize;
    
    pixels.forEach((pixel, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const color = pixel.style.background || 'white';
        ctx.fillStyle = color;
        ctx.fillRect(col, row, 1, 1);
    });
    
    // Scale up for better quality
    const scaledCanvas = document.createElement('canvas');
    const scaledCtx = scaledCanvas.getContext('2d');
    scaledCanvas.width = gridSize * 20;
    scaledCanvas.height = gridSize * 20;
    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
    
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = scaledCanvas.toDataURL();
    link.click();
}

init();
