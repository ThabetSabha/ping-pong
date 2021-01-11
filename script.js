const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');


canvas.width = window.innerWidth - 18;
canvas.height = window.innerHeight - 18;

//Paddles & Ball properties;
const ballRadius = 20;
const paddleWidth = 15/1000 * canvas.width;
const paddleHeight = 1.2/7 * canvas.height;


//Ball position & speed
let ballX = (canvas.width - ballRadius) / 2;
let ballY = (canvas.height - ballRadius) / 2;
let ballSpeedX = 0.008 * canvas.width;
let ballSpeedY = 0.005 * canvas.height;


//Paddles' positions
let paddle1X = 0;
let paddle1Y = paddleHeight;

let paddle2X = canvas.width - paddleWidth;
let paddle2Y = (canvas.height - paddleHeight) / 2;

//Player Scores
let player1Score = 0;
let player2Score = 0;
let maxScore = 10;
let isGameStarted = false;
let isGameOver = false;


window.onload = function () {
    const framesPerSecond = 90;
    setInterval(() => {
        drawEverything();
        moveEverything();
    }, 1000 / framesPerSecond);
}



//called when one side scores, resets components to their original place;
const resetPositions = () => {
    ballSpeedX *= -1;
    ballSpeedY *= 0.3;
    ballX = (canvas.width - ballRadius) / 2;
    ballY = (canvas.height - ballRadius) / 2;
    paddle2Y = (canvas.height - paddleHeight) / 2;

    if (player1Score >= maxScore || player2Score >= maxScore) {
        isGameOver = true;
    }
}

//Handles the movement for the right paddle (Player 2);
const computerMovement = () => {
    let paddle2YCenter = paddle2Y + paddleHeight / 2;
    if (ballY > paddle2YCenter + paddleHeight / 2) {
        paddle2Y += 0.01 * canvas.height;
    } else if (paddle2YCenter > ballY) {
        paddle2Y -= 0.01 * canvas.height;
    }
}


const moveEverything = () => {

    if (isGameOver || !isGameStarted) {
        return;
    }

    computerMovement();

    //When ball hits left side or Paddle1:
    if (ballX < (0 + ballRadius)) {
        //Checks to see if the ball hit the paddle
        if (ballY >= (paddle1Y - ballRadius) && ballY <= (paddle1Y + paddleHeight + ballRadius)) {
            ballSpeedX *= -1;
            let deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.3;
        } else {
            player2Score++;
            resetPositions();

        }
    }

    //When ball hits right side or Paddle2:
    if (ballX >= (canvas.width - ballRadius)) {
        //Checks to see if the ball hit the paddle
        if (ballY >= (paddle2Y - ballRadius) && ballY <= (paddle2Y + paddleHeight + ballRadius)) {
            ballSpeedX *= -1;
            let deltaY = ballY - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.3;
        } else {
            player1Score++;
            resetPositions();
        }
    }

    //If ball hits top/bottom:
    if (ballY >= (canvas.height - ballRadius) || ballY < (0 + ballRadius)) {
        ballSpeedY *= -1;
    }

    //Moves the ball in X and Y directions depending on ball speed;
    ballY += ballSpeedY;
    ballX += ballSpeedX;

}




const drawEverything = () => {

    //If the Game is over checks who won and displays it on screen;
    if (isGameOver) {
        let winner = player1Score > player2Score ? 'Left Player' : 'Computer';
        canvasContext.fillStyle = 'white';
        canvasContext.fillText(`Game Over, ${winner} won!`, (canvas.width - 100) / 2, 300)
        canvasContext.fillText("Click to continue", (canvas.width - 50) / 2, 400);
        return
    }

    if(!isGameStarted) {

        drawRect(0, 0, canvas.width, canvas.height, 'black');
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("Click to start", (canvas.width - 100) / 2, 300);
        return
    }

    //draw canvas
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    //draw net 
    drawNet();

    //draw paddles
    //1
    drawRect(paddle1X, paddle1Y, paddleWidth, paddleHeight, 'white');
    //2
    drawRect(paddle2X, paddle2Y, paddleWidth, paddleHeight, 'white');

    //draw ball
    drawBall(ballX, ballY, ballRadius, 'white');

    //draw scores
    canvasContext.fillText(`Player 1 Score: ${player1Score}`, 100, 100);
    canvasContext.fillText(`Player 2 Score: ${player2Score}`, (canvas.width - 220), 100);
}







//To calculate the position of the player's paddle, called when mouse moves;
const calculateMousePosition = (evt) => {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return mouseY;
}


canvas.addEventListener('mousemove', (e) => {
    let mousePos = calculateMousePosition(e);
    paddle1Y = mousePos - paddleHeight / 2;
})





//For when game is over;
const handleMouseDown = () => {
    if (isGameOver || !isGameStarted) {
        player1Score = 0;
        player2Score = 0;
        isGameOver = false;
        isGameStarted = true;
    }
}

canvas.addEventListener('mousedown', handleMouseDown);




//Draw Functions: 
const drawNet = () => {
    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

const drawRect = (centerX, centerY, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(centerX, centerY, width, height);
}


const drawBall = (x, y, radius, color) => {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}
