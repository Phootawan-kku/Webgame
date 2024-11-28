const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');

// Set canvas size

canvas.width = 480;

canvas.height = 320;

// Ball properties

let x = canvas.width / 2;

let y = canvas.height - 30;

let dx = 2;

let dy = -2;

const ballRadius = 10;

// Paddle properties

const paddleHeight = 15; // Increased height

const paddleWidth = 100; // Increased width

let paddleX = (canvas.width - paddleWidth) / 2;

// Control properties

let rightPressed = false;

let leftPressed = false;

// Brick properties

const brickRowCount = 3;

const brickColumnCount = 5;

const brickWidth = 75;

const brickHeight = 20;

const brickPadding = 10;

const brickOffsetTop = 30;

const brickOffsetLeft = 30;

const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {

    bricks[c] = [];

    for (let r = 0; r < brickRowCount; r++) {

        bricks[c][r] = { x: 0, y: 0, status: 1 };

    }

}

// Game over flag

let gameOver = false;

// Event listeners for keyboard and touch controls

document.addEventListener('keydown', keyDownHandler);

document.addEventListener('keyup', keyUpHandler);

canvas.addEventListener('touchstart', touchStartHandler);

canvas.addEventListener('touchmove', touchMoveHandler);

function keyDownHandler(e) {

    if (e.key === 'Right' || e.key === 'ArrowRight') {

        rightPressed = true;

    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {

        leftPressed = true;

    }

}

function keyUpHandler(e) {

    if (e.key === 'Right' || e.key === 'ArrowRight') {

        rightPressed = false;

    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {

        leftPressed = false;

    }

}

function touchStartHandler(e) {

    const touchX = e.touches[0].clientX - canvas.offsetLeft;

    updatePaddlePosition(touchX);

}

function touchMoveHandler(e) {

    const touchX = e.touches[0].clientX - canvas.offsetLeft;

    updatePaddlePosition(touchX);

}

function updatePaddlePosition(touchX) {

    paddleX = touchX - paddleWidth / 2;

    // Ensure paddle stays within canvas bounds

    if (paddleX < 0) {

        paddleX = 0;

    } else if (paddleX > canvas.width - paddleWidth) {

        paddleX = canvas.width - paddleWidth;

    }

}

function drawBall() {

    ctx.beginPath();

    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);

    ctx.fillStyle = '#0095DD';

    ctx.fill();

    ctx.closePath();

}

function drawPaddle() {

    ctx.beginPath();

    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

    ctx.fillStyle = '#0095DD';

    ctx.fill();

    ctx.closePath();

}

function drawBricks() {

    for (let c = 0; c < brickColumnCount; c++) {

        for (let r = 0; r < brickRowCount; r++) {

            if (bricks[c][r].status === 1) {

                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;

                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

                bricks[c][r].x = brickX;

                bricks[c][r].y = brickY;

                ctx.beginPath();

                ctx.rect(brickX, brickY, brickWidth, brickHeight);

                ctx.fillStyle = '#0095DD';

                ctx.fill();

                ctx.closePath();

            }

        }

    }

}

function collisionDetection() {

    for (let c = 0; c < brickColumnCount; c++) {

        for (let r = 0; r < brickRowCount; r++) {

            const brick = bricks[c][r];

            if (brick.status === 1) {

                if (

                    x > brick.x &&

                    x < brick.x + brickWidth &&

                    y > brick.y &&

                    y < brick.y + brickHeight

                ) {

                    dy = -dy;

                    brick.status = 0;

                }

            }

        }

    }

}

function drawGameOver() {

    ctx.font = '30px Arial';

    ctx.fillStyle = '#FF0000';

    ctx.textAlign = 'center';

    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

    // Ask user if they want to restart the game

    setTimeout(() => {

        if (confirm('Game Over! Do you want to restart the game?')) {

            restartGame();

        }

    }, 100); // Delay to ensure game over text is shown

}

function restartGame() {

    // Reset game state

    x = canvas.width / 2;

    y = canvas.height - 30;

    dx = 2;

    dy = -2;

    paddleX = (canvas.width - paddleWidth) / 2;

    // Reset bricks

    for (let c = 0; c < brickColumnCount; c++) {

        for (let r = 0; r < brickRowCount; r++) {

            bricks[c][r].status = 1;

        }

    }

    gameOver = false;

    draw(); // Restart the game loop

}

function draw() {

    if (gameOver) {

        drawGameOver();

        return; // Stop the game loop

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();

    drawBall();

    drawPaddle();

    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {

        dx = -dx;

    }

    if (y + dy < ballRadius) {

        dy = -dy;

    } else if (y + dy > canvas.height - ballRadius) {

        if (x > paddleX && x < paddleX + paddleWidth) {

            dy = -dy;

        } else {

            gameOver = true; // Set game over flag

        }

    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {

        paddleX += 7;

    } else if (leftPressed && paddleX > 0) {

        paddleX -= 7;

    }

    x += dx;

    y += dy;

    requestAnimationFrame(draw);

}

draw();

