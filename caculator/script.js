const display = document.getElementById('display');

function appendToDisplay(input) {
    if (display.innerText === "0" || display.innerText === "Error") {
        display.innerText = input;
    } else {
        display.innerText += input;
    }
}

function clearDisplay() {
    display.innerText = "0";
}

function calculate() {
    try {
        // eval() takes the text and performs math
        const result = eval(display.innerText);
        
        // Ensure long decimals don't break the layout
        display.innerText = Number.isInteger(result) ? result : result.toFixed(4);
    } catch (error) {
        display.innerText = "Error";
    }
}