// 1. Find our "Hook" in the HTML
const typewriterElement = document.getElementById("typewriter-text");

// 2. This variable keeps track of which letter we are on
let characterIndex = 0;

/**
 * The Typewriter Function
 * @param {string} message - The story text for the current level
 * @param {number} speed - How fast to type (in milliseconds)
 */
function startTypewriter(message, speed = 50) {
    // Clear the box before starting a new message
    typewriterElement.innerHTML = "";
    characterIndex = 0;

    function type() {
        if (characterIndex < message.length) {
            // Add one character to the div
            typewriterElement.innerHTML += message.charAt(characterIndex);
            characterIndex++;
            
            // Wait for 'speed' amount of time, then run 'type' again
            setTimeout(type, speed);
        }
    }

    type(); // Launch the inner loop
}

// 3. Testing it out with Level 1's story!
const level1Story = "The iron gate groans. 'Print the password to enter,' Lint whispers. 'The Alchemist hates uninvited guests.'";

startTypewriter(level1Story, 40);