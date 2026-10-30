const board = document.getElementById('board');
const squares = document.querySelectorAll('.square');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

let currentPlayer = 'X';
let gameOver = false;
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleClick(e) {
  const square = e.target;
  const squareIndex = Array.from(squares).indexOf(square);

  if (square.textContent || gameOver) {
    return;
  }

  square.textContent = currentPlayer;

  if (checkWin()) {
    message.textContent = `${currentPlayer} wins!`;
    gameOver = true;
    return;
  }

  if (checkDraw()) {
    message.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWin() {
  return winningCombos.some(combo => {
    return combo.every(index => {
      return squares[index].textContent === currentPlayer;
    });
  });
}

function checkDraw() {
  return Array.from(squares).every(square => {
    return square.textContent;
  });
}

function resetGame() {
  squares.forEach(square => {
    square.textContent = '';
  });
  message.textContent = '';
  currentPlayer = 'X';
  gameOver = false;
}

squares.forEach(square => {
  square.addEventListener('click', handleClick);
});

restartBtn.addEventListener('click', resetGame);