const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const bgMusic = document.getElementById("sound-bg");
const failSound = document.getElementById("sound-fail");

let gameRunning = true;
let score = 0;
let asteroids = [];
let stars = [];
let asteroidTimer = 0;
let asteroidInterval = 45;

let highScore = localStorage.getItem("spaceHighScore") || 0;
highScoreEl.textContent = highScore;

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 80,
    w: 30,
    h: 30,
    speed: 7
};

// Create Starfield
for (let i = 0; i < 60; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 3 + 1
    });
}

function createAsteroid() {
    asteroids.push({
        x: Math.random() * (canvas.width - 30),
        y: -50,
        size: Math.random() * 20 + 20,
        speed: 3.5 + (score / 1200)
    });
}

function drawBackground() {
    ctx.fillStyle = "white";
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;
    });
}

function drawPlayer() {
    ctx.fillStyle = "lime";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "lime";
    ctx.beginPath();
    ctx.moveTo(player.x + player.w/2, player.y);
    ctx.lineTo(player.x, player.y + player.h);
    ctx.lineTo(player.x + player.w, player.y + player.h);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawAsteroids() {
    ctx.fillStyle = "#ff4757";
    asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x + a.size/2, a.y + a.size/2, a.size/2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkCollision() {
    asteroids.forEach(a => {
        if (
            player.x < a.x + a.size - 6 &&
            player.x + player.w > a.x + 6 &&
            player.y < a.y + a.size - 6 &&
            player.y + player.h > a.y + 6
        ) {
            endGame();
        }
    });
}

function endGame() {
    gameRunning = false;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    failSound.play();

    gameOverScreen.style.display = "block";
    let final = Math.floor(score / 10);
    finalScoreEl.textContent = final;
    if (final > highScore) {
        localStorage.setItem("spaceHighScore", final);
        highScoreEl.textContent = final;
    }
}

function restartGame() {
    asteroids = [];
    score = 0;
    player.x = canvas.width / 2 - 15;
    gameRunning = true;
    gameOverScreen.style.display = "none";
    bgMusic.play();
    requestAnimationFrame(gameLoop);
}

function initMusic() {
    bgMusic.play();
    window.removeEventListener('keydown', initMusic);
    window.removeEventListener('touchstart', initMusic);
}
window.addEventListener('keydown', initMusic);
window.addEventListener('touchstart', initMusic);

restartBtn.addEventListener("click", restartGame);

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function handleInput() {
    if ((keys["ArrowLeft"] || keys["a"]) && player.x > 0) player.x -= player.speed;
    if ((keys["ArrowRight"] || keys["d"]) && player.x < canvas.width - player.w) player.x += player.speed;
}

document.getElementById("leftBtn").ontouchstart = (e) => { e.preventDefault(); if(player.x > 0) player.x -= 40; };
document.getElementById("rightBtn").ontouchstart = (e) => { e.preventDefault(); if(player.x < canvas.width - player.w) player.x += 40; };
document.getElementById("dodgeBtn").ontouchstart = (e) => { e.preventDefault(); player.x = Math.random() * (canvas.width - player.w); };

function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    handleInput();
    drawPlayer();

    asteroidTimer++;
    if (asteroidTimer > asteroidInterval) {
        createAsteroid();
        asteroidTimer = 0;
    }

    asteroids.forEach(a => a.y += a.speed);
    asteroids = asteroids.filter(a => a.y < canvas.height + 50);

    drawAsteroids();
    checkCollision();

    score++;
    scoreEl.textContent = Math.floor(score / 10);
    requestAnimationFrame(gameLoop);
}

gameLoop();