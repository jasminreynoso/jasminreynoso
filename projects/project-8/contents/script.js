// Conversion factors to meters
const toMeters = {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    mile: 1609.34,
    foot: 0.3048,
    inch: 0.0254
};

function convert() {
    const inputValue = parseFloat(document.getElementById('inputValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    // Convert to meters first, then to target unit
    const valueInMeters = inputValue * toMeters[fromUnit];
    const result = valueInMeters / toMeters[toUnit];
    
    document.getElementById('outputValue').value = result.toFixed(6);
}

convert();

