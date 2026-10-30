const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

// Game board size
const boxSize = 20;
const canvasSize = 400;

// Game Stats
let gameOver = false;
let score = 0;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;


// Snake Stats
let snake =  [{x: 150, y:150}];
let dir = "RIGHT";



// Controls

function controls(e) {
  const key = e.keyCode;
  if (key === 37 && dir !==  "RIGHT") dir = "LEFT";
  else if (key === 38 && dir !== "DOWN") dir = "UP";
  else if (key === 39 && dir !== "LEFT") dir= "RIGHT";
  else if (key === 40 && dir !== "UP") dir = "DOWN";
}

// Movement

function move() {
  let head = {...snake[0]};
 
  if (dir === "RIGHT") head.x += boxSize;
  else if (dir === "LEFT") head.x -= boxSize;
  else if (dir === "UP") head.y += boxSize;
  else if (dir === "DOWN") head.y -= boxSize;

  snake.unshift(head);
}

// draw
function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize); // change to new after

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
    move();
    eatFood();
    collision();
}

function generateFood(){
      return {
        x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
    };
}

function eatFood(){
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
}


function collision(){
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasSize ||
        head.y >= canvasSize ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    alert("Game Over! Your score: " + score);
    location.reload();
}



function resetGame() {

 let snake =  [{x: 150, y:150}];
let dir = "RIGHT";
score = 0;
  gameOver = false;
}

setInterval(draw,200);

document.addEventListener("keydown", controls);

restartBtn.addEventListener('click', resetGame);


/**
 *  Idea for Game
 * 
 * Snake Size addition 
 * Class of Snake 
 *  - Size
 *  - Position (update position of each piece)
 *  - Part to Location (Head | Tail)
 *  - Collision (Self or Wall) / Food or Nothing 
 * 
 * 
 * 
 * 
 */
