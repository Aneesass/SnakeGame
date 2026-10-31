// Environment
const canvas = document.getElementById("gameBoard"); // gets gameboard elements
const ctx = canvas.getContext("2d"); // context 
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const rstBtn = document.getElementById("restartBtn");

// Static Values
const boxSize = 20;
// Canva x & y size
const canvasSizex = 300;
const canvasSizey = 420;
const cols = canvasSizex / boxSize;
const rows = canvasSizey / boxSize;
canvas.width = canvasSizex;
canvas.height = canvasSizey;


// Game Values
let snake, dir, nextDir, food, score;
let loop = null;
let gameOver = true;
let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreEl.textContent = highScore;


// main

function controls(e) {
  const k = e.key;
  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
  }
  if (k === "ArrowLeft" && dir !== "RIGHT") nextDir = "LEFT";
  else if (k === "ArrowUp" && dir !== "DOWN") nextDir = "UP";
  else if (k === "ArrowRight" && dir !== "LEFT") nextDir = "RIGHT";
  else if (k === "ArrowDown" && dir !== "UP") nextDir = "DOWN";
  else if (k === "Escape" && loop) endGame();
}



// helper

function spawnFood() {
  let pos;
  do {
    pos = {
      x : Math.floor(Math.random() * (canvasSizex / boxSize)) * boxSize,
      y : Math.floor(Math.random() * (canvasSizey / boxSize)) * boxSize,
      type : Math.random() < 0.5 ? "apple" : "banana",
    };
  } while (snake.some((s)=> s.x === pos.x && s.y === pos.y));
  return pos;
}

function setSpeed(ms) {
  clearInterval(loop);
  loop = setInterval(tick, ms);
}

function update() {
  dir = nextDir;
  const head = {...snake[0]};

  // position update

  if (dir === "RIGHT") head.x += boxSize;
  else if (dir === "LEFT") head.x -= boxSize;
  else if (dir === "UP") head.y -= boxSize;
  else if (dir === "DOWN") head.y += boxSize;

  // colisions

  const hitWall = head.x < 0 || head.y < 0 || head.x >= canvasSizex || head.y >= canvasSizey;
  const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);

  if (hitWall || hitSelf) return endGame();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = spawnFood();
    setSpeed(Math.max(80, 200 - score *5));
  } else {
    snake.pop(); 
  }


}

function draw() {
  ctx.clearRect(0, 0, canvasSizex, canvasSizey);
  drawFruit();
  drawSnake(snake, boxSize);
}

function tick() {
  update()
  if (loop) draw();
}

function endGame() {
  clearInterval(loop);
  gameOver = true;
  loop = null;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreEl.textContent = highScore;
  }
  alert("Game Over! Your score: " + score + "\n" );

}

function resetGame() {
  clearInterval(loop);
  snake = [{ x: 160, y: 160 }];
  dir = nextDir = "RIGHT";
  score = 0;
  scoreEl.textContent = score;
  food = spawnFood();
  draw();
  loop = setInterval(tick, 200);
}

function drawFruit() {
  if (food.type === "apple") drawApple(food.x, food.y, 20);
  else drawBanana(food.x, food.y, 20);
}

function drawBanana(x, y, size) {

  const px = (u) => x + size * u;
  const py = (v) => y + size * v;

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1, size * 0.07);
  ctx.strokeStyle = "black";

 
  ctx.beginPath();
  ctx.moveTo(px(0.84), py(0.20));                                  
  ctx.bezierCurveTo(px(0.92), py(0.65), px(0.60), py(0.95), px(0.15), py(0.85)); 
  ctx.quadraticCurveTo(px(0.03), py(0.80), px(0.10), py(0.68));  
  ctx.bezierCurveTo(px(0.45), py(0.62), px(0.68), py(0.40), px(0.70), py(0.20)); 
  ctx.closePath();
  ctx.fillStyle = "#ffe135";
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "#f0b90b";
  ctx.lineWidth = size * 0.14;
  ctx.beginPath();
  ctx.moveTo(px(0.86), py(0.25));
  ctx.bezierCurveTo(px(0.90), py(0.65), px(0.60), py(0.93), px(0.18), py(0.86));
  ctx.stroke();
  ctx.restore();

  // Outline
  ctx.beginPath();
  ctx.moveTo(px(0.84), py(0.20));
  ctx.bezierCurveTo(px(0.92), py(0.65), px(0.60), py(0.95), px(0.15), py(0.85));
  ctx.quadraticCurveTo(px(0.03), py(0.80), px(0.10), py(0.68));
  ctx.bezierCurveTo(px(0.45), py(0.62), px(0.68), py(0.40), px(0.70), py(0.20));
  ctx.closePath();
  ctx.stroke();

  // stem
  ctx.beginPath();
  ctx.moveTo(px(0.69), py(0.21));
  ctx.lineTo(px(0.71), py(0.06));
  ctx.lineTo(px(0.84), py(0.06));
  ctx.lineTo(px(0.85), py(0.21));
  ctx.closePath();
  ctx.fillStyle = "#7a4a1e";
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawApple(x, y, size) {
  const cx = x + size / 2;
  const cy = y + size * 0.58;
  const r = size * 0.36;


  // body
  ctx.lineWidth = Math.max(1, size * 0.07);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.7);
  ctx.bezierCurveTo(
    cx + r * 0.3, cy - r * 1.2,
    cx + r * 1.3, cy - r * 0.9,
    cx + r * 1.1, cy + r * 0.2
  );
  ctx.bezierCurveTo(
    cx + r * 0.9, cy + r * 1.1,
    cx + r * 0.3, cy + r * 1.2,
    cx, cy + r * 0.95
  );
  ctx.bezierCurveTo(
    cx - r * 0.3, cy + r * 1.2,
    cx - r * 0.9, cy + r * 1.1,
    cx - r * 1.1, cy + r * 0.2
  );
  ctx.bezierCurveTo(
    cx - r * 1.3, cy - r * 0.9,
    cx - r * 0.3, cy - r * 1.2,
    cx, cy - r * 0.7
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
 

  // stem
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + size * 0.05, y + size * 0.12);
  ctx.strokeStyle = "brown";
  ctx.stroke();

  // leaf
  ctx.fillStyle = "green";
  ctx.strokeStyle = "darkgreen";
  ctx.beginPath();
  ctx.ellipse(cx + size * 0.18, y + size * 0.2, size * 0.14, size * 0.07, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

}
function drawSnake(snake, size) {
  snake.forEach((seg, i) => {
    const x = seg.x, y = seg.y;
 
    // alternating stripe colours
    ctx.fillStyle = i % 2 === 0 ? "#0b8124" : "#004f13";
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.max(1, size * 0.07);
 
    // rounded body segment
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, size - 2, size - 2, size * 0.3);
    ctx.fill();
    ctx.stroke();
 
    // scale detail
    if (i !== 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = Math.max(1, size * 0.06);
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.2, Math.PI, 0);
      ctx.stroke();
    }
  });
 
  // head direction
  const head = snake[0];
  const next = snake[1] || head;
  let dx = Math.sign(head.x - next.x);
  let dy = Math.sign(head.y - next.y);
  if (dx === 0 && dy === 0) dx = 1;
 
  const cx = head.x + size / 2;
  const cy = head.y + size / 2;
  const px = -dy, py = dx;
  const eyeR = size * 0.12;
 
  // eyes
  [-1, 1].forEach((side) => {
    const ex = cx + dx * size * 0.15 + px * side * size * 0.2;
    const ey = cy + dy * size * 0.15 + py * side * size * 0.2;
 
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
    ctx.fill();
 
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(ex + dx * eyeR * 0.4, ey + dy * eyeR * 0.4, eyeR * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
 
  // tongue
  ctx.strokeStyle = "red";
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx + dx * size * 0.45, cy + dy * size * 0.45);
  ctx.lineTo(cx + dx * size * 0.7, cy + dy * size * 0.7);
  ctx.stroke();
}


document.addEventListener("keydown", controls);
rstBtn.addEventListener("click", resetGame);

resetGame();