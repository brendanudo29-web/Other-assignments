const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const background = document.getElementById("background-layer");
const message = document.getElementById("message");
const scoreElement = document.getElementById("current-score");
const highElement = document.getElementById("high-score");

// Sound Elements
const jumpSound = document.getElementById("sound-jump");
const failSound = document.getElementById("sound-fail");
const bgMusic = document.getElementById("sound-bg");

let score = 0;
let isGameRunning = false;
let gameSpeed = 1.6;
let highScore = localStorage.getItem("runnerHighScore") || 0;
highElement.innerText = highScore;

function startGame() {
    isGameRunning = true;
    score = 0;
    gameSpeed = 1.6;
    
    message.style.display = "none";
    obstacle.classList.add("obstacle-move");
    background.classList.add("bg-animate");
    
    obstacle.style.animationDuration = gameSpeed + "s";
    
    // Play Background Music
    bgMusic.currentTime = 0;
    bgMusic.play().catch(e => console.log("Audio play blocked until interaction"));
    
    runGameLoop();
}

function jump() {
    if (!isGameRunning) {
        startGame();
    } else if (!player.classList.contains("animate-jump")) {
        jumpSound.currentTime = 0;
        jumpSound.play();
        player.classList.add("animate-jump");
        setTimeout(() => player.classList.remove("animate-jump"), 500);
    }
}

function runGameLoop() {
    const loop = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(loop);
            return;
        }

        score++;
        let displayScore = Math.floor(score / 10);
        scoreElement.innerText = displayScore;

        // Difficulty Increase
        if (displayScore > 0 && displayScore % 100 === 0) {
            gameSpeed = Math.max(0.6, gameSpeed - 0.005);
            obstacle.style.animationDuration = gameSpeed + "s";
        }

        // Precise Collision Detection
        let pRect = player.getBoundingClientRect();
        let oRect = obstacle.getBoundingClientRect();

        if (
            pRect.right > oRect.left + 5 && // Added 5px buffer for fairness
            pRect.left < oRect.right - 5 &&
            pRect.bottom > oRect.top + 5
        ) {
            gameOver(displayScore);
            clearInterval(loop);
        }
    }, 10);
}

function gameOver(finalScore) {
    isGameRunning = false;
    bgMusic.pause();
    failSound.play();
    
    obstacle.classList.remove("obstacle-move");
    background.classList.remove("bg-animate");
    
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem("runnerHighScore", highScore);
        highElement.innerText = highScore;
    }

    message.style.display = "block";
    message.innerHTML = `GAME OVER!<br>SCORE: ${finalScore}<br>TAP TO RESTART`;
}

// Input Handling
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
    }
});

window.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        e.preventDefault();
        jump();
    }
}, { passive: false });

window.addEventListener("mousedown", (e) => {
    if (e.button === 0) jump();
});