// Get necessary elements
const display = document.getElementById("display");
const historyDisplay = document.getElementById("history-display");
const buttons = document.querySelectorAll("button");

let history = JSON.parse(localStorage.getItem("calculatorHistory")) || []; // Load history from localStorage
let currentExpression = "";

// Function to update the display
function updateDisplay(value) {
    if (display.textContent === "0" || display.textContent === "Error") {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
    currentExpression += value;
}

// Function to clear the display
function clearDisplay() {
    display.textContent = "0";
    currentExpression = "";
}

// Function to perform safe calculation
function calculate() {
    try {
        // Replace symbols for evaluation
        let expression = currentExpression.replace(/×/g, "*").replace(/÷/g, "/");

        // Evaluate the expression
        const result = math.evaluate(expression);

        // Check if the result is finite
        if (!isFinite(result)) {
            display.textContent = "Overflow";
            return;
        }

        // Handle large numbers using BigInt if necessary
        const resultString = (Number(result) > Number.MAX_SAFE_INTEGER)
            ? BigInt(Math.floor(result)).toString()
            : result.toString();

        display.textContent = resultString;

        // Add to history
        addToHistory(currentExpression, resultString);

        // Reset current expression
        currentExpression = resultString;
    } catch (error) {
        console.error("Calculation Error:", error);
        display.textContent = "Error";
        currentExpression = "";
    }
}

// Function to add the calculation to history
function addToHistory(expression, result) {
    if (!historyDisplay) return;

    // Limit history to 10 records
    if (history.length >= 10) {
        history.shift();
    }

    const historyEntry = `${expression} = ${result}`;
    history.push(historyEntry);
    updateHistoryDisplay();

    // Store history in localStorage
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
}

// Function to update the history display
function updateHistoryDisplay() {
    if (!historyDisplay) return;
    historyDisplay.innerHTML = history.map(entry => `<p>${entry}</p>`).join("");
}

// Function to clear the history
function clearHistory() {
    history = [];
    updateHistoryDisplay();
    // Clear history from localStorage
    localStorage.removeItem("calculatorHistory");
}

// Event listeners for all buttons
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent;

        switch (value) {
            case "C":
                clearDisplay();
                break;
            case "⌫":
                currentExpression = currentExpression.slice(0, -1);
                display.textContent = currentExpression || "0";
                break;
            case "=":
                calculate();
                break;
            case "π":
                updateDisplay(Math.PI.toString());
                currentExpression += Math.PI.toString();
                break;
            case "e":
                updateDisplay(Math.E.toString());
                currentExpression += Math.E.toString();
                break;
            default:
                updateDisplay(value);
                break;
        }
    });
});

// Load history when the page loads
window.onload = () => {
    updateHistoryDisplay();
};
