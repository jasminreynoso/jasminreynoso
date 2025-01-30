let passages = [];
let usedPassages = new Set(); // Track used passages
let currentRound = 1;
let maxRounds = 5;
let score = 0;


// Shuffle the word bank before displaying
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Fetch the passages from the JSON file
async function loadPassages() {
    const response = await fetch("assets/data/passages.json");
    passages = await response.json();
    loadNewRound();
}

// Load a new passage with blanks, ensuring it's unique
function loadNewRound() {
    if (currentRound > maxRounds) {
        endGame();
        return;
    }

    document.getElementById("round").textContent = `Round: ${currentRound} / ${maxRounds}`;
    document.getElementById("score").textContent = `Score: ${score}`;

    if (passages.length === 0) {
        console.error("No passages available.");
        return;
    }

    let randomPassage;
    let attempts = 0;
    do {
        randomPassage = passages[Math.floor(Math.random() * passages.length)];
        attempts++;
    } while (usedPassages.has(randomPassage.text) && usedPassages.size < passages.length && attempts < 10);

    usedPassages.add(randomPassage.text);

 
    // Format passage with input fields
let passageText = randomPassage.text.split(/(\s+|\b)/); // Split while keeping spaces and punctuation
let answerIndex = 0;

let formattedText = passageText.map(word => {
    if (word.trim() === "___" && answerIndex < randomPassage.answers.length) {
        return `<input type="text" class="blank" data-answer="${randomPassage.answers[answerIndex++]}">`;
    }
    return word;
}).join("");

    
    document.getElementById("passage-text").innerHTML = formattedText;

    // Populate the word bank
    let wordBankList = document.getElementById("word-list");
    wordBankList.innerHTML = ""; // Clear previous word bank

    shuffleArray(randomPassage.word_bank); // Shuffle the word bank before displaying

    randomPassage.word_bank.forEach(word => {
        let listItem = document.createElement("li");
        listItem.textContent = word;
        wordBankList.appendChild(listItem);
    });
}

// End game and handle leaderboard
function endGame() {
    let initials = prompt("Game over! Enter your initials (up to 4 characters):").slice(0, 4).toUpperCase();
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({ initials, score });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

    displayLeaderboard();
}
// Check user answers
function submitAnswers() {
    let blanks = document.querySelectorAll(".blank");
    let correctCount = 0;

    blanks.forEach(blank => {
        if (blank.value.trim().toLowerCase() === blank.dataset.answer.toLowerCase()) {
            correctCount++;
            blank.style.border = "2px solid green";
        } else {
            blank.style.border = "2px solid red";
        }
    });

    score += correctCount;
    currentRound++;

    setTimeout(loadNewRound, 2000); // Load new passage after delay
}


// Display leaderboard
function displayLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardHTML = `<h2>Leaderboard</h2><ul>`;

    leaderboard.slice(0, 5).forEach(entry => {
        leaderboardHTML += `<li>${entry.initials}: ${entry.score}</li>`;
    });

    leaderboardHTML += `</ul>`;
    document.body.innerHTML = leaderboardHTML;
}

// Reset the game when a new game starts
function resetGame() {
    usedPassages.clear();
    score = 0;
    currentRound = 1;
    loadNewRound();
}

document.addEventListener("DOMContentLoaded", loadPassages);
