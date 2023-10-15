// Get the canvas element and its context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let caraList = [];
let points = 1;

let startTime = 0;
let elapsedTime = 0;
let timerInterval;

// Square properties
let initializedLucas = false;

const image = new Image();
image.src = "../images/boss.png";
let rotationAngle = 0;
let won = false;

const caraImage = new Image();
caraImage.src = "../images/cara.png";
let caraHeight = 20;
let caraWidth = 15;
let caraY = 50;
let caraVelocityY = 10;

let bossX = 425;
let bossY = 100;
let bossHeight = 200;
let bossWidth = 150;

let playerX = 450;
let playerY = 600;
let playerHeight = 10;
let playerWidth = 100;
let playerSpeed = 20;
const squareColor = "blue";

let ballX = 450;
let ballY = 100;
let ballHeight = 10;
let ballWidth = 10;
let ballVelocityX;
let ballVelocityY;
const ballColor = "white";

// Function to draw the square
function drawPlayer() {
    ctx.fillStyle = squareColor;
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawBall() {
    updateBallPos();
    ctx.fillStyle = ballColor;
    ctx.fillRect(ballX, ballY, ballWidth, ballHeight);
}

function drawLucas() {
    ctx.save();

    // Translate to the center of the image
    ctx.translate(playerX + 45, bossY + 140);

    // Apply the rotation
    ctx.rotate((rotationAngle * Math.PI) / 180);

    // Draw the image at its center
    ctx.drawImage(image, -bossWidth / 2, -bossHeight / 2, bossWidth, bossHeight);

    // Restore the canvas state to avoid affecting other elements
    ctx.restore();
    if (points > 0) {
        drawText("You have activated my trap card!", 350, 350, "red", 20);
    } else {
        drawText("Fail!", 300, 350, "red", 200);
    }
    
}

function drawCannon() {
    ctx.fillStyle = squareColor;
    ctx.fillRect(playerX - 10 + playerWidth/2, playerY - 60, 20, 60);    
}

function drawCaras() {
    if (caraList.length == 0) {
        caraList.push(Math.random() * 1000);
        caraList.push(Math.random() * 1000);
        caraList.push(Math.random() * 1000);
        caraList.push(Math.random() * 1000);
        caraList.push(Math.random() * 1000);
        caraList.push(Math.random() * 1000);
    }
    caraList.forEach(cara => {
        ctx.drawImage(caraImage, cara, caraY, caraWidth, caraHeight);
    });

    caraY += caraVelocityY;

    if(caraY > canvas.height) {
        caraList = [];
        caraY = 50;
    }
}

function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initializeGame() {
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    won = false;

    playerX = 450;
    playerY = 600;

    ballX = 450;
    ballY = 100;
    ballVelocityX = 5;
    ballVelocityY = 5;

    caraY = 50;

    initializedLucas = false;
    if(points <= 0) {
        points = 1;
        update();
    }
}

// Event listener to handle arrow key presses for square movement
function update() {
    clearCanvas();

    drawPlayer();
    drawBall();
    checkCollision();

    if(initializedLucas) {
        if(startTime == 0)  startBossTimer();
        if (!won) drawLucas();
        else drawText("YOU WIN!", 150, 350, "green", 150);
        drawCaras();
        drawText("Lives: " + points, 465, 400, "yellow", 20);
        drawText("Time: " + elapsedTime + "s", 50, 50, "yellow", 20);
    } else {
        drawText("Score: " + points, 465, 400, "yellow", 20);
    }

    if (elapsedTime > 10) {
        drawCannon();
    }

    rotationAngle += 1;

    if (points > 0) {
        requestAnimationFrame(update);
    }
};

function shootCannon() {
    won = true;
}

function startBossTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
}

function updatePlayerPosition(distance) {
    if (playerX > 0 && (playerX + playerWidth) < canvas.width) {
        playerX += distance;
    } else if (playerX <= 0) {
        playerX = 1;
    } else {
        playerX = canvas.width - playerWidth -1
    }
}

function updateBallPos() {
    ballX += ballVelocityX;
    ballY += ballVelocityY;
    if (ballY <= 0) ballVelocityY = -ballVelocityY;
    if (ballX <= 0) ballVelocityX = -ballVelocityX;
    if (ballY >= (canvas.height - ballHeight)) {
        ballVelocityX = 0;
        ballVelocityY = 0;
        initializedLucas = true;
    }
    if (ballX >= (canvas.width - ballWidth)) ballVelocityX = -ballVelocityX;

    if (ballX > playerX && ballX < playerX + playerWidth) {
        if (ballY + ballHeight > playerY && ballY < playerY + playerHeight) {
            ballVelocityY = -ballVelocityY;
            points += 1;
        }
    }
}

function checkCollision() {
    caraList.forEach(x => {
        if (x > playerX && x < playerX + playerWidth) {
            if (caraY + ballHeight > playerY && caraY < playerY + playerHeight) {
                points -= 1;
                caraList = [];
                caraY = 50;
            }
        }
    });
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            updatePlayerPosition(-playerSpeed);
            break;
        case "ArrowRight":
            updatePlayerPosition(playerSpeed);
            break;
        case "e":
            if (elapsedTime > 10) {
                shootCannon();
            }
            break;
    }
});

document.getElementById("startButton").addEventListener("click", () => {
    initializeGame();
});

// Initial square drawing
initializeGame();
update();