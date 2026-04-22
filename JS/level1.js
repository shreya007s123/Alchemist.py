// --- LEVEL 1 LOGIC ---
const levelData = {
    speaker: "THE CAT",
    text: [
        "Greetings, Apprentice.",
        "You have entered the Alchemist's Domain...",
        "To cross this line, you must first prove your wit.",
        "Click on the lock, solve the riddle, and print the password."
    ],
    background: "assets/level1/doorZoom.png",
    riddle: "I have whiskers and a tail. I am black from head to toe. I sit upon your porch, and say 'Meow'. What am I?"
};

const typewriterElement = document.getElementById("typewriter-text");
const pythonInput = document.getElementById('python-input');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set background
    document.body.style.backgroundImage = `url('${levelData.background}')`;
    
    // 2. Start initial dialogue chain
    startTypewriter(levelData.text[0], typewriterElement, 40, () => {
        // Chain your other text segments here...
        // Once finished, call activateLock()
    });

    setupSubmitButton('python-input', 'submit-pass');
});

function activateLock() {
    const lockHitbox = document.createElement('div');
    lockHitbox.id = "lock-hitbox";
    lockHitbox.className = "hitbox-style"; // Use CSS for the positioning
    document.getElementById('game-ui').appendChild(lockHitbox);

    lockHitbox.addEventListener('click', () => {
        document.getElementById('lock-overlay').style.display = 'flex';
        runMonitorSequence();
    });
}

// Add 'async' here so we can use 'await' inside
pythonInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const userInput = e.target.value.trim();
        const feedback = document.getElementById('typewriter-feedback');

        // 1. Show a small "Processing..." hint so the user knows it's running
        feedback.innerHTML = "Executing Python...";

        // 2. RUN THE REAL PYTHON CODE
        // evaluatePython() must be defined in your script.js
        const output = await evaluatePython(userInput);

        // 3. CHECK THE CAPTURED OUTPUT
        // We check if what Python PRINTED is exactly "cat"
        if (output === "cat") {
            feedback.style.color = "#00ff00"; // Success Green
            startTypewriter("Success! The gate opens.", feedback, 40, () => {
                setTimeout(() => { 
                    window.location.href = "level2.html"; 
                }, 1500);
            });
        } 
        else if (output.startsWith("Error:")) {
            // Show the actual Python error (SyntaxError, etc.)
            feedback.style.color = "#ff4444"; 
            feedback.innerHTML = output; 
        } 
        else {
            feedback.style.color = "#ffffff";
            feedback.innerHTML = `Output was "${output}". Try again!`;
        }
    }
});