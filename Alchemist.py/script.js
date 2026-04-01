// --- 1. DATA & VARIABLES ---
const gameLevels = {
    1: {
        speaker: "THE CAT",
        text: [
            "Greetings, Apprentice.",
            "You have entered the Alchemist\'s Domain, a realm where reality is woven from Python code.", 
            "To cross this line, you must first prove your wit.",
            "Click on the lock, solve the riddle, and print the password to enter the mansion."
        ],
        background: "Level 1.png",
        riddle: "I have whiskers and a tail. I am black from head to toe. I sit upon your porch, and say 'Meow'. What am I?"
    }, 
    2: {
        speaker: "Mysterious Voice",
        text: ["Who dares enter the sanctum of the Python Alchemist?"],
        background: "mansion_interior.jpg"
    }
};

const typewriterElement = document.getElementById("typewriter-text");
const welcomeScreen = document.getElementById('welcome-screen');
const gameUI = document.getElementById('game-ui');
const startBtn = document.getElementById('start-btn');

// --- 2. THE TYPEWRITER ENGINE ---
function startTypewriter(message, targetElement, speed = 40, callback = null) {
    if (!message || !targetElement) return; 
    targetElement.innerHTML = "";
    let characterIndex = 0;

    function type() {
        if (characterIndex < message.length) {
            targetElement.innerHTML += message.charAt(characterIndex);
            characterIndex++;
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    type(); 
}

// --- 3. START GAME LOGIC ---
startBtn.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    const loadingScreen = document.getElementById('loading-screen');
    const loadingMessage = document.getElementById('loading-message');
    const dialogueBox = document.querySelector('.dialogue-box');

    loadingScreen.style.display = 'flex';

    const messages = ["Transmuting lead into gold...", "Herding magical dust bunnies...", "Calibrating Lint's attitude..."];
    loadingMessage.innerText = messages[Math.floor(Math.random() * messages.length)];

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        gameUI.style.display = 'block';
        document.body.style.backgroundImage = "url('Level 1.png')"; 

        setTimeout(() => {
            dialogueBox.style.display = 'block'; 
            document.querySelector(".speaker-name").innerText = gameLevels[1].speaker;

            // Dialogue Sequence
            startTypewriter(gameLevels[1].text[0], typewriterElement);
            setTimeout(() => startTypewriter(gameLevels[1].text[1], typewriterElement), 6000); 
            setTimeout(() => startTypewriter(gameLevels[1].text[2], typewriterElement), 12000);
            setTimeout(() => {
                startTypewriter(gameLevels[1].text[3], typewriterElement);
                activateLock(); 
            }, 18000);

        }, 2000); 
        localStorage.setItem('mansion_save', 'level_1');
    }, 3000);
});

// --- 4. LOCK MONITOR SEQUENCE ---
function activateLock() {
    // Avoid creating multiple hitboxes if they click back and forth
    if (document.getElementById('lock-hitbox')) return;

    const lockHitbox = document.createElement('div');
    lockHitbox.id = "lock-hitbox";
    // Calibration: top:40%; left:62%;
    lockHitbox.style.cssText = "position:absolute; top:40%; left:62%; width:80px; height:120px; cursor:pointer; z-index:5;";
    gameUI.appendChild(lockHitbox);

    lockHitbox.addEventListener('click', () => {
        document.getElementById('lock-overlay').style.display = 'flex';
        document.querySelector('.dialogue-box').style.display = 'none';
        runMonitorSequence();
    });
}

function runMonitorSequence() {
    const riddleZone = document.getElementById('typewriter-riddle');
    const prompt = document.getElementById('prompt-container');
    const input = document.getElementById('python-input');
    const feedback = document.getElementById('typewriter-feedback');
    
    // Clear old state
    prompt.style.display = 'none';
    feedback.innerHTML = "";
    input.value = "";

    startTypewriter(gameLevels[1].riddle, riddleZone, 30, () => {
        prompt.style.display = 'block';
        input.focus(); 
    });
}

// Handle the Password Check via Enter Key
document.getElementById('python-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const userInput = e.target.value.toLowerCase().trim();
        const feedback = document.getElementById('typewriter-feedback');

        // Logic check: User must type print("cat") or print('cat')
        if (userInput === 'print("cat")' || userInput === "print('cat')") {
            e.target.disabled = true;
            startTypewriter("good job", feedback, 50, () => {
                setTimeout(() => {
                    document.getElementById('lock-overlay').style.display = 'none';
                    document.querySelector('.dialogue-box').style.display = 'block';
                    startTypewriter("The gate groans open. You may enter.", typewriterElement);
                }, 1500);
            });
        } else {
            feedback.innerHTML = "Syntax Error: Use print(\"name\")";
            setTimeout(() => { feedback.innerHTML = ""; }, 3000);
        }
    }
});

// Also handle the "Print Answer" button if they click that instead of Enter
document.getElementById('submit-pass').addEventListener('click', () => {
    const input = document.getElementById('python-input');
    const event = new KeyboardEvent('keypress', { key: 'Enter' });
    input.dispatchEvent(event);
});