const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800; canvas.height = 450;

let gameActive = false, score = 0, level = 1, enemies = [], projectiles = [];
const keys = {};

// Audio Setup
const bgMusic = document.getElementById('bg-music');
const sfxShoot = document.getElementById('sfx-shoot');
const sfxHit = document.getElementById('sfx-hit');
const sfxLevel = document.getElementById('sfx-levelup');

let player = { x: 50, y: 200, size: 30, color: '#8a2be2', hp: 100, maxHp: 100, speed: 5, invuln: false };
let boss = { active: false, x: 650, y: 150, size: 100, hp: 1000, maxHp: 1000, dir: 1 };

document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('selection-screen').classList.remove('hidden');
});

function chooseHero(type) {
    if (type === 'brian') { player.hp = 150; player.maxHp = 150; player.color = '#8a2be2'; player.speed = 4; }
    else { player.hp = 80; player.maxHp = 80; player.color = '#00ffff'; player.speed = 7; }
    
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    
    bgMusic.volume = 0.2;
    bgMusic.play();
    gameActive = true;
    spawnEnemy();
    animate();
}

// Logic & Combat
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

canvas.addEventListener('mousedown', e => {
    if(!gameActive) return;
    sfxShoot.currentTime = 0; sfxShoot.play();
    const rect = canvas.getBoundingClientRect();
    const tx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const ty = (e.clientY - rect.top) * (canvas.height / rect.height);
    const angle = Math.atan2(ty - (player.y + 15), tx - (player.x + 15));
    projectiles.push({ x: player.x+15, y: player.y+15, vx: Math.cos(angle)*12, vy: Math.sin(angle)*12 });
});

function spawnEnemy() {
    if(!gameActive || boss.active) return;
    enemies.push({ x: canvas.width, y: Math.random()*(canvas.height-30), size: 30, speed: 3 + (level*1.2) });
    setTimeout(spawnEnemy, Math.max(400, 1200 - (level*200)));
}

function update() {
    if((keys['KeyW'] || keys['ArrowUp']) && player.y > 0) player.y -= player.speed;
    if((keys['KeyS'] || keys['ArrowDown']) && player.y < canvas.height - player.size) player.y += player.speed;

    if(score >= 100 && level === 1) { level = 2; sfxLevel.play(); showMsg("CASTLE ENTRANCE"); }
    if(score >= 250 && level === 2) { level = 3; boss.active = true; sfxLevel.play(); showMsg("FINAL BOSS"); }

    projectiles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if(p.x > canvas.width || p.x < 0) projectiles.splice(i, 1);
        if(boss.active && p.x > boss.x && p.x < boss.x+boss.size && p.y > boss.y && p.y < boss.y+boss.size) {
            boss.hp -= 10; projectiles.splice(i, 1);
            if(boss.hp <= 0) { gameActive = false; showMsg("REALM SAVED!"); document.getElementById('death-title').innerText = "VICTORY"; document.getElementById('game-over-overlay').classList.remove('hidden'); }
        }
    });

    enemies.forEach((en, i) => {
        en.x -= en.speed;
        if(player.x < en.x+en.size && player.x+player.size > en.x && player.y < en.y+en.size && player.y+player.size > en.y) {
            enemies.splice(i,1); player.hp -= 20; sfxHit.play();
            document.getElementById('hp-bar').style.width = (player.hp/player.maxHp*100) + "%";
            if(player.hp <= 0) { gameActive = false; document.getElementById('game-over-overlay').classList.remove('hidden'); }
        }
        projectiles.forEach((p, pi) => {
            if(p.x > en.x && p.x < en.x+en.size && p.y > en.y && p.y < en.y+en.size) {
                enemies.splice(i,1); projectiles.splice(pi,1); score += 10;
                document.getElementById('score-text').innerText = "Score: " + score;
            }
        });
    });

    if(boss.active) {
        boss.y += 4 * boss.dir;
        if(boss.y <= 0 || boss.y >= canvas.height - boss.size) boss.dir *= -1;
        if(Math.random() < 0.05) enemies.push({ x: boss.x, y: boss.y + 50, size: 20, speed: 6 });
    }
}

function showMsg(t) {
    const m = document.getElementById('overlay-msg');
    m.innerText = t; m.classList.remove('hidden');
    setTimeout(() => m.classList.add('hidden'), 3000);
}

function draw() {
    ctx.fillStyle = level === 3 ? '#1a0000' : '#05050a';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.size, player.size);

    if(boss.active) {
        ctx.fillStyle = "#222"; ctx.fillRect(boss.x, boss.y, boss.size, boss.size);
        ctx.fillStyle = "red"; ctx.fillRect(boss.x, boss.y - 15, (boss.hp/boss.maxHp)*boss.size, 10);
    }

    ctx.fillStyle = "red"; enemies.forEach(en => ctx.fillRect(en.x, en.y, en.size, en.size));
    ctx.fillStyle = "cyan"; projectiles.forEach(p => ctx.fillRect(p.x, p.y, 6, 6));
}

function animate() {
    if(!gameActive) return;
    update(); draw();
    requestAnimationFrame(animate);
}