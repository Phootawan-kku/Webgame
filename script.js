function checkWin() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                return false;  // Brick still exists
            }
        }
    }
    return true;  // All bricks destroyed
}

function drawWin() {
    ctx.font = '30px Arial';
    ctx.fillStyle = '#00FF00';
    ctx.textAlign = 'center';
    ctx.fillText('You Won!', canvas.width / 2, canvas.height / 2);

    setTimeout(() => {
        if (confirm('You Won! Do you want to restart the game?')) {
            restartGame();
        }
    }, 100);
}

function draw() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    if (checkWin()) {
        drawWin();
        return;
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
            gameOver = true;
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
