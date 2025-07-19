const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let score = { X: 0, O: 0 };

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.dataset.index = i;
    div.addEventListener("click", handleClick);
    boardElement.appendChild(div);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  makeMove(index, "X");

  if (!gameActive) return;
  setTimeout(aiTurn, 300);
}

function makeMove(index, player) {
  board[index] = player;
  renderBoard();

  const winner = checkWinner(board);
  if (winner) {
    if (winner !== "draw") {
      const combo = getWinningCombo(board);
      highlightWin(winner, combo);
      statusElement.textContent = `Player ${winner} wins!`;
      score[winner]++;
      updateScore();
    } else {
      statusElement.textContent = "It's a draw!";
    }
    gameActive = false;
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

function aiTurn() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  makeMove(move, "O");
}

function minimax(newBoard, depth, isMax) {
  const result = checkWinner(newBoard);
  if (result === "O") return 10 - depth;
  if (result === "X") return depth - 10;
  if (result === "draw") return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, depth + 1, false));
        newBoard[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, depth + 1, true));
        newBoard[i] = "";
      }
    }
    return best;
  }
}

function checkWinner(bd) {
  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return bd[a];
  }
  return bd.includes("") ? null : "draw";
}

function getWinningCombo(bd) {
  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return combo;
  }
  return [];
}

function highlightWin(player, combo) {
  combo.forEach(index => {
    const cell = boardElement.children[index];
    if (player === "X") {
      cell.classList.add("x-win");
    } else {
      cell.classList.add("o-win");
    }
  });
}

function updateScore() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
}

function resetGame() {
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  statusElement.textContent = "Player X's turn";
  renderBoard();
}

resetBtn.addEventListener("click", resetGame);
renderBoard();