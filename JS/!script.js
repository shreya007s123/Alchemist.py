// --- GLOBAL ENGINE ---
let pyodide;

// Initialize Python
async function initPython() {
    pyodide = await loadPyodide();
    // This tells Python where to send "print" statements (to our JS console/variable)
    await pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
    `);
    console.log("Python Alchemist is ready.");
}

// Function to run and capture output
async function evaluatePython(code) {
    try {
        // Clear previous output
        await pyodide.runPythonAsync("sys.stdout.truncate(0); sys.stdout.seek(0)");
        
        // Execute user code
        await pyodide.runPythonAsync(code);
        
        // Return whatever was printed to the console
        return pyodide.runPython("sys.stdout.getvalue()").trim();
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

// The Typewriter: Used by all levels for dialogue
function startTypewriter(message, targetElement, speed = 40, callback = null) {
    if (!message || !targetElement) return; 
    targetElement.innerHTML = "";
    let characterIndex = 0;

    function type() {
        if (characterIndex < message.length) {
            targetElement.innerHTML += message.charAt(characterIndex);
            characterIndex++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type(); 
}

// Utility to trigger the 'Enter' key logic via button click
function setupSubmitButton(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(buttonId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        input.dispatchEvent(event);
    });
}