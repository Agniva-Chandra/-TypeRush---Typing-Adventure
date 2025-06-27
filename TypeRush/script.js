const gameTexts = [
    "The brave knight ventured into the dark forest, seeking the legendary crystal that would save the kingdom from eternal darkness.",
    "Captain Nova fired the quantum engines as the starship approached the mysterious planet filled with alien technology and ancient secrets.",
    "The wizard cast a powerful spell, summoning lightning bolts that danced across the battlefield, illuminating the fierce battle ahead.",
    "Deep in the cyberpunk city, the hacker infiltrated the mega-corporation's database, searching for evidence of their illegal experiments.",
    "The pirate ship sailed through treacherous waters, chasing the ghost vessel that held the key to unlimited treasure.",
    "In the post-apocalyptic wasteland, survivors built a fortress to protect themselves from the mutant creatures that roamed the night.",
    "The ninja moved silently through the shadows, avoiding laser security systems while infiltrating the enemy stronghold.",
    "The time traveler activated the chronometer, jumping between different eras to prevent the catastrophic timeline from occurring.",
    "The space marine explored the abandoned space station, encountering hostile aliens and discovering the dark truth about the mission.",
    "The detective solved the mystery by analyzing clues, following leads, and uncovering the conspiracy that threatened the entire city.",
    "The rogue android hacked into the security mainframe, triggering alarms across the orbital station as it searched for the lost prototype.",
    "The archaeologist uncovered ancient ruins, deciphering cryptic symbols that hinted at a powerful artifact hidden deep within the earth.",
    "The sorceress summoned a portal to another dimension, where mythical creatures and powerful magic awaited her.",
    "The rebel fighter pilot engaged in a dogfight against the imperial fleet, dodging laser blasts and executing daring maneuvers.",
    "The alchemist mixed rare ingredients to create a potion that would grant extraordinary abilities, but  the recipe was incomplete.",
    "The explorer trekked through the icy tundra, searching for the lost city of gold   that was rumored to be hidden beneath the glaciers.",
    "The cyborg bounty hunter tracked down a dangerous fugitive, using advanced technology to enhance its senses and skills.",
    "A surge of plasma erupted from the reactor core as the crew scrambled to stabilize the failing starcruiser deep in uncharted space.",
    "With a flash of ancient runes, the portal cracked open, pulling the sorceress into a dimension ruled by shadows and forgotten gods",
    "As lightning danced across the desert sky, the scavenger unearthed a relic pulsing with energy not seen since the fall of the old world.",
    "The mech warrior leapt over the molten crater, plasma cannons blazing as the enemy swarm advanced from the horizon.",
    "Navigating through a storm of meteors, the pilot locked onto the hidden docking bay of the derelict alien vessel.",
    "The rebel prince drew his blade of starlight, ready to challenge the tyrant who ruled the galaxy with an iron grip.",
    "In the neon glow of the cybercity, the data thief sprinted across rooftops, clutching the stolen chip that could rewrite history",
    "Time fractured around the explorer as they activated the chronogate, stepping into a future where machines ruled the Earth.",
    "As the ancient dragon awoke beneath the mountain, its roar echoed across the kingdoms, signaling the start of a new age.",

];

// Game state using in-memory storage only (no localStorage)
let gameState = {
    level: 1,
    score: 0,
    combo: 0,
    maxCombo: 0,
    experience: 0,
    experienceToNext: 100,
    text: '',
    pos: 0,
    active: false,
    timeLeft: 60,
    interval: null,
    correct: 0,
    total: 0,
    powerUps: { time: 3, score: 2, slow: 1 },
    activePowerUps: {},
    achievements: {},
    scores: [],
    startTime: null
};

const elements = {
    level: document.getElementById('level'),
    score: document.getElementById('score'),
    combo: document.getElementById('combo'),
    timer: document.getElementById('timer'),
    wpm: document.getElementById('wpm'),
    levelProgress: document.getElementById('levelProgress'),
    textDisplay: document.getElementById('textDisplay'),
    typingInput: document.getElementById('typingInput'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    newBtn: document.getElementById('newBtn'),
    modal: document.getElementById('resultModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalStats: document.getElementById('modalStats'),
    newAchievements: document.getElementById('newAchievements'),
    scoresList: document.getElementById('scoresList'),
    celebration: document.getElementById('celebration')
};

function init() {
    createStars();
    newQuest();
    updateDisplay();
    updateLeaderboard();
    updateAchievements();
    addEventListeners();
}

function addEventListeners() {
    elements.startBtn.addEventListener('click', startGame);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.newBtn.addEventListener('click', newQuest);
    elements.typingInput.addEventListener('input', handleInput);
    elements.typingInput.addEventListener('keydown', handleKeydown);
}

function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

function newQuest() {
    gameState.text = gameTexts[Math.floor(Math.random() * gameTexts.length)];
    gameState.pos = 0;
    elements.typingInput.value = '';
    showText();
}

function showText() {
    elements.textDisplay.innerHTML = gameState.text.split('').map((char, i) => 
        `<span class="char" data-i="${i}">${char}</span>`
    ).join('');
}

function startGame() {
    if (gameState.active) return;
    
    gameState.active = true;
    gameState.timeLeft = 60;
    gameState.pos = 0;
    gameState.correct = 0;
    gameState.total = 0;
    gameState.combo = 0;
    gameState.startTime = Date.now();
    
    elements.typingInput.disabled = false;
    elements.typingInput.placeholder = "Type the adventure story...";
    elements.typingInput.focus();
    elements.typingInput.value = '';
    elements.startBtn.disabled = true;
    
    showText();
    gameState.interval = setInterval(tick, 100);
    updateDisplay();
}

function resetGame() {
    gameState.active = false;
    clearInterval(gameState.interval);
    
    gameState.score = 0;
    gameState.combo = 0;
    gameState.pos = 0;
    gameState.timeLeft = 60;
    gameState.correct = 0;
    gameState.total = 0;
    gameState.activePowerUps = {};
    
    elements.typingInput.disabled = true;
    elements.typingInput.placeholder = "🎮 Press START to begin your adventure!";
    elements.typingInput.value = '';
    elements.startBtn.disabled = false;
    
    updatePowerUpButtons();
    showText();
    updateDisplay();
}

function tick() {
    gameState.timeLeft -= 0.1;
    
    if (gameState.activePowerUps.slow) {
        gameState.timeLeft += 0.05; // Slow time effect
    }
    
    if (gameState.timeLeft <= 0) {
        gameState.timeLeft = 0;
        endGame();
    }
    
    updateDisplay();
}

function handleInput(e) {
    if (!gameState.active) return;
    updateDisplay();
}

function handleKeydown(e) {
    if (!gameState.active) return;
    
    // Check if game is complete
    if (elements.typingInput.value.length >= gameState.text.length) {
        endGame();
    }
}

function endGame() {
    gameState.active = false;
    clearInterval(gameState.interval);
    
    elements.typingInput.disabled = true;
    elements.startBtn.disabled = false;
    
    const wpm = getWPM();
    const accuracy = getAccuracy();
    
    // Calculate final score
    let finalScore = gameState.score;
    if (gameState.activePowerUps.score) {
        finalScore *= 2;
    }
    
    gameState.score = finalScore;
    
    // Add experience and check level up
    const expGained = Math.floor(wpm * accuracy / 10);
    gameState.experience += expGained;
    
    while (gameState.experience >= gameState.experienceToNext) {
        levelUp();
    }
    
    // Check achievements
    const newAchievements = checkAchievements(wpm, accuracy);
    
    // Add to leaderboard
    addScore(wpm, accuracy, finalScore);
    
    // Show results
    showResults(wpm, accuracy, finalScore, expGained, newAchievements);
    
    // Reset power-ups
    gameState.activePowerUps = {};
    updatePowerUpButtons();
}

function levelUp() {
    gameState.experience -= gameState.experienceToNext;
    gameState.level++;
    gameState.experienceToNext = Math.floor(gameState.experienceToNext * 1.2);
    
    // Reward power-ups on level up
    gameState.powerUps.time++;
    if (gameState.level % 2 === 0) gameState.powerUps.score++;
    if (gameState.level % 3 === 0) gameState.powerUps.slow++;
    
    createCelebration();
}

function createCelebration() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#ffd700', '#ff006e', '#8338ec', '#00d4ff'][Math.floor(Math.random() * 4)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        elements.celebration.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function usePowerUp(type) {
    if (gameState.powerUps[type] <= 0 || !gameState.active) return;
    
    gameState.powerUps[type]--;
    gameState.activePowerUps[type] = true;
    
    const button = document.getElementById(type === 'time' ? 'timeBoost' : type === 'score' ? 'doubleScore' : 'slowTime');
    button.classList.add('active');
    
    if (type === 'time') {
        gameState.timeLeft += 15;
        setTimeout(() => {
            delete gameState.activePowerUps[type];
            button.classList.remove('active');
            updatePowerUpButtons();
        }, 1000);
    } else {
        setTimeout(() => {
            delete gameState.activePowerUps[type];
            button.classList.remove('active');
            updatePowerUpButtons();
        }, 10000);
    }
    
    updatePowerUpButtons();
}

function updatePowerUpButtons() {
    const timeBtn = document.getElementById('timeBoost');
    const scoreBtn = document.getElementById('doubleScore');
    const slowBtn = document.getElementById('slowTime');
    
    if (timeBtn) {
        timeBtn.disabled = gameState.powerUps.time <= 0 || !gameState.active;
        timeBtn.textContent = `⏰ Time Boost (${gameState.powerUps.time})`;
    }
    
    if (scoreBtn) {
        scoreBtn.disabled = gameState.powerUps.score <= 0 || !gameState.active;
        scoreBtn.textContent = `⭐ Double Score (${gameState.powerUps.score})`;
    }
    
    if (slowBtn) {
        slowBtn.disabled = gameState.powerUps.slow <= 0 || !gameState.active;
        slowBtn.textContent = `🐌 Slow Time (${gameState.powerUps.slow})`;
    }
}

function updateDisplay() {
    if (elements.level) elements.level.textContent = gameState.level;
    if (elements.score) elements.score.textContent = gameState.score;
    if (elements.combo) elements.combo.textContent = gameState.combo;
    if (elements.timer) elements.timer.textContent = Math.max(0, gameState.timeLeft).toFixed(1);
    if (elements.wpm) elements.wpm.textContent = getWPM();
    
    if (elements.levelProgress) {
        const progress = (gameState.experience / gameState.experienceToNext) * 100;
        elements.levelProgress.style.width = progress + '%';
    }
    
    updateTypingDisplay();
    updatePowerUpButtons();
}

function updateTypingDisplay() {
    const userInput = elements.typingInput.value;
    const chars = elements.textDisplay.querySelectorAll('.char');
    
    let correct = 0;
    let total = userInput.length;
    
    chars.forEach((char, i) => {
        char.classList.remove('correct', 'incorrect', 'current');
        
        if (i < userInput.length) {
            if (userInput[i] === gameState.text[i]) {
                char.classList.add('correct');
                correct++;
            } else {
                char.classList.add('incorrect');
            }
        } else if (i === userInput.length) {
            char.classList.add('current');
        }
    });
    
    gameState.correct = correct;
    gameState.total = total;
    
    // Update score and combo
    if (total > 0) {
        const accuracy = correct / total;
        if (accuracy === 1 && total > gameState.pos) {
            gameState.combo++;
            gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
            gameState.score += gameState.combo * 10;
        } else if (accuracy < 1) {
            gameState.combo = 0;
        }
        gameState.pos = total;
    }
}

function getWPM() {
    if (!gameState.startTime) return 0;
    const timeElapsed = (Date.now() - gameState.startTime) / 1000 / 60; // minutes
    const wordsTyped = gameState.correct / 5; // 5 characters = 1 word
    return Math.round(wordsTyped / timeElapsed) || 0;
}

function getAccuracy() {
    if (gameState.total === 0) return 100;
    return Math.round((gameState.correct / gameState.total) * 100);
}

function checkAchievements(wpm, accuracy) {
    const newAchievements = [];
    
    const achievements = [
        { id: 'speedster', name: 'Speed Demon', desc: 'Type 60+ WPM', check: wpm >= 60 },
        { id: 'accurate', name: 'Perfectionist', desc: '100% Accuracy', check: accuracy === 100 },
        { id: 'combo10', name: 'Combo Master', desc: '10+ Character Combo', check: gameState.maxCombo >= 10 },
        { id: 'level5', name: 'Experienced', desc: 'Reach Level 5', check: gameState.level >= 5 },
        { id: 'score1000', name: 'High Scorer', desc: 'Score 1000+ Points', check: gameState.score >= 1000 }
    ];
    
    achievements.forEach(achievement => {
        if (achievement.check && !gameState.achievements[achievement.id]) {
            gameState.achievements[achievement.id] = true;
            newAchievements.push(achievement);
        }
    });
    
    return newAchievements;
}

function addScore(wpm, accuracy, score) {
    const scoreEntry = {
        wpm,
        accuracy,
        score,
        level: gameState.level,
        date: new Date().toLocaleDateString()
    };
    
    gameState.scores.push(scoreEntry);
    gameState.scores.sort((a, b) => b.score - a.score);
    gameState.scores = gameState.scores.slice(0, 10); // Keep top 10
}

function updateLeaderboard() {
    if (!elements.scoresList) return;
    
    elements.scoresList.innerHTML = gameState.scores.length ? 
        gameState.scores.map((score, i) => 
            `<div class="score-entry">
                <span class="rank">#${i + 1}</span>
                <span class="score-wpm">${score.wpm} WPM</span>
                <span class="score-accuracy">${score.accuracy}%</span>
                <span class="score-points">${score.score} pts</span>
                <span class="score-date">${score.date}</span>
            </div>`
        ).join('') :
        '<div class="no-scores">No scores yet - start typing to set your first record!</div>';
}

function updateAchievements() {
    const achievementsContainer = document.getElementById('achievementsList');
    if (!achievementsContainer) return;
    
    const allAchievements = [
        { id: 'speedster', name: 'Speed Demon', desc: 'Type 60+ WPM' },
        { id: 'accurate', name: 'Perfectionist', desc: '100% Accuracy' },
        { id: 'combo10', name: 'Combo Master', desc: '10+ Character Combo' },
        { id: 'level5', name: 'Experienced', desc: 'Reach Level 5' },
        { id: 'score1000', name: 'High Scorer', desc: 'Score 1000+ Points' }
    ];
    
    achievementsContainer.innerHTML = allAchievements.map(achievement => 
        `<div class="achievement ${gameState.achievements[achievement.id] ? 'unlocked' : 'locked'}">
            <span class="achievement-icon">${gameState.achievements[achievement.id] ? '🏆' : '🔒'}</span>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
        </div>`
    ).join('');
}

function showResults(wpm, accuracy, score, expGained, newAchievements) {
    if (!elements.modal) return;
    
    elements.modalTitle.textContent = accuracy === 100 ? 'Perfect Adventure!' : 'Quest Complete!';
    
    elements.modalStats.innerHTML = `
        <div class="stat-row">
            <span class="stat-label">Words Per Minute:</span>
            <span class="stat-value">${wpm}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Accuracy:</span>
            <span class="stat-value">${accuracy}%</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Score:</span>
            <span class="stat-value">${score}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Max Combo:</span>
            <span class="stat-value">${gameState.maxCombo}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Experience Gained:</span>
            <span class="stat-value">+${expGained} XP</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Current Level:</span>
            <span class="stat-value">${gameState.level}</span>
        </div>
    `;
    
    if (newAchievements.length > 0) {
        elements.newAchievements.innerHTML = `
            <h4>🎉 New Achievements!</h4>
            ${newAchievements.map(achievement => 
                `<div class="new-achievement">
                    <span class="achievement-icon">🏆</span>
                    <div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.desc}</div>
                    </div>
                </div>`
            ).join('')}
        `;
        elements.newAchievements.style.display = 'block';
    } else {
        elements.newAchievements.style.display = 'none';
    }
    
    elements.modal.style.display = 'flex';
    updateLeaderboard();
    updateAchievements();
    
    // Auto close modal after 5 seconds
    setTimeout(() => {
        if (elements.modal.style.display === 'flex') {
            closeModal();
        }
    }, 5000);
}

function closeModal() {
    if (elements.modal) {
        elements.modal.style.display = 'none';
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add modal close functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close-btn')) {
        closeModal();
    }
});

// Add power-up button event listeners
document.addEventListener('DOMContentLoaded', () => {
    const timeBoostBtn = document.getElementById('timeBoost');
    const doubleScoreBtn = document.getElementById('doubleScore');
    const slowTimeBtn = document.getElementById('slowTime');
    
    if (timeBoostBtn) timeBoostBtn.addEventListener('click', () => usePowerUp('time'));
    if (doubleScoreBtn) doubleScoreBtn.addEventListener('click', () => usePowerUp('score'));
    if (slowTimeBtn) slowTimeBtn.addEventListener('click', () => usePowerUp('slow'));
});    