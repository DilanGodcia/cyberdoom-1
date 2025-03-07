let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth;
let boardHeight;
let context;

// Ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX;
let shipY;
let shipVelocityX = tileSize;

let ship = {
    x: 0,
    y: 0,
    width: shipWidth,
    height: shipHeight,
    lives: 3
};

let shipImg = new Image();
shipImg.src = "./img/ship.png";

// Aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienRows = 2;
let alienColumns = 3;
let alienVelocityX = 1;
let alienCount = 0;

let alienImg = new Image();
alienImg.src = "./img/alien.png";

// Bullets
let bulletArray = [];
let bulletVelocityY = -10;

// Alien bullets
let alienBulletArray = [];
let alienBulletVelocityY = 5;

let score = 0;
let YouDie = false;

window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d");
    
    resizeCanvas();
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
    window.addEventListener("resize", resizeCanvas);
};

function resizeCanvas() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    boardWidth = board.width;
    boardHeight = board.height;

    ship.x = boardWidth / 2 - ship.width / 2;
    ship.y = boardHeight - ship.height * 2;
}

function update() {
    requestAnimationFrame(update);

    if (YouDie) {
        context.fillStyle = "red";
        context.font = "40px Arial";
        context.fillText("You Die", boardWidth / 2 - 100, boardHeight / 2);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Draw ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    
    // Draw aliens
    alienArray.forEach(alien => {
        if (alien.alive) {
            alien.x += alienVelocityX;
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alienArray.forEach(a => a.y += alienHeight);
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            
            if (Math.random() < 0.005) {
                alienShoot(alien);
            }
            
            if (alien.y + alien.height >= ship.y) {
                loseLife();
            }
        }
    });
    
    // Bullets
    bulletArray.forEach((bullet, index) => {
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        alienArray.forEach(alien => {
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        });
    });
    bulletArray = bulletArray.filter(b => !b.used && b.y > 0);

    // Alien bullets
    alienBulletArray.forEach((bullet, index) => {
        bullet.y += alienBulletVelocityY;
        context.fillStyle = "red";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        if (detectCollision(bullet, ship)) {
            loseLife();
            bullet.used = true;
        }
    });
    alienBulletArray = alienBulletArray.filter(b => !b.used && b.y < boardHeight);

    // Next level
    if (alienCount === 0) {
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
        alienVelocityX += alienVelocityX > 0 ? 0.2 : -0.2;
        createAliens();
    }

    // Score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(`Score: ${score}  Lives: ${ship.lives}`, 10, 20);
}

function moveShip(e) {
    if (YouDie) return;
    if (e.code === "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    } else if (e.code === "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}

function shoot(e) {
    if (YouDie) return;
    if (e.code === "Space") {
        bulletArray.push({
            x: ship.x + ship.width / 2 - 2,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        });
    }
}

function alienShoot(alien) {
    alienBulletArray.push({
        x: alien.x + alien.width / 2 - 2,
        y: alien.y + alien.height,
        width: tileSize / 8,
        height: tileSize / 2,
        used: false
    });
}

function createAliens() {
    alienArray = [];
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            alienArray.push({
                x: c * alienWidth + 20,
                y: r * alienHeight + 20,
                width: alienWidth,
                height: alienHeight,
                alive: true
            });
        }
    }
    alienCount = alienArray.length;
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function loseLife() {
    ship.lives--;
    if (ship.lives <= 0) {
        YouDie = true;
    }
}
