// Canvas setup
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// UI elements
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

// High score storage
let highScore = localStorage.getItem("spaceHighScore") || 0;
highScoreEl.textContent = highScore;

// Game state
let gameRunning = true;
let score = 0;

// Player object
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 50,
  width: 40,
  height: 40,
  speed: 6
};

// Asteroids
let asteroids = [];
let asteroidTimer = 0;
let asteroidInterval = 60;

// Create asteroid
function createAsteroid() {
  asteroids.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: 3 + score / 500
  });
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = "lime";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.shadowBlur = 0;
}

// Draw asteroids
function drawAsteroids() {
  ctx.fillStyle = "red";
  asteroids.forEach(a => {
    ctx.fillRect(a.x, a.y, a.size, a.size);
  });
}

// Move asteroids
function updateAsteroids() {
  asteroids.forEach(a => a.y += a.speed);
  asteroids = asteroids.filter(a => a.y < canvas.height + 40);
}

// Collision detection
function checkCollision() {
  asteroids.forEach(a => {
    if (
      player.x < a.x + a.size &&
      player.x + player.width > a.x &&
      player.y < a.y + a.size &&
      player.y + player.height > a.y
    ) {
      endGame();
    }
  });
}

// End game
function endGame() {
  gameRunning = false;
  gameOverScreen.style.display = "block";
  finalScoreEl.textContent = score;

  if (score > highScore) {
    localStorage.setItem("spaceHighScore", score);
  }
}

// Restart game
function restartGame() {
  asteroids = [];
  score = 0;
  player.x = canvas.width / 2 - 20;
  gameRunning = true;
  gameOverScreen.style.display = "none";
  highScore = localStorage.getItem("spaceHighScore") || 0;
  highScoreEl.textContent = highScore;
  requestAnimationFrame(gameLoop);
}

restartBtn.addEventListener("click", restartGame);

// Player movement
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width)
    player.x += player.speed;
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();

  asteroidTimer++;
  if (asteroidTimer > asteroidInterval) {
    createAsteroid();
    asteroidTimer = 0;
  }

  updateAsteroids();
  drawAsteroids();
  checkCollision();

  score++;
  scoreEl.textContent = score;

  requestAnimationFrame(gameLoop);
}

gameLoop();
document.getElementById("left").ontouchstart = () => moveLeft();
document.getElementById("right").ontouchstart = () => moveRight();
document.getElementById("dodge").ontouchstart = () => dodge();

