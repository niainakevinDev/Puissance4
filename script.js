// ============================================
// 🎮 PUISSANCE 4 - Version 2 Joueurs
// ============================================

class Game {
  constructor() {
    this.ROWS = 6;
    this.COLS = 7;
    this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
    this.currentPlayer = 'red';
    this.winner = null;
    this.history = [];
    this.isGameOver = false;
    this.moveCount = 0;
  }

  clone() {
    const newGame = new Game();
    newGame.board = this.board.map(row => [...row]);
    newGame.currentPlayer = this.currentPlayer;
    newGame.winner = this.winner;
    newGame.history = [...this.history];
    newGame.isGameOver = this.isGameOver;
    newGame.moveCount = this.moveCount;
    return newGame;
  }

  dropToken(col) {
    if (this.isGameOver || col < 0 || col >= this.COLS) return null;
    const row = this.findEmptyRow(col);
    if (row === -1) return null;

    const newGame = this.clone();
    newGame.board[row][col] = this.currentPlayer;
    newGame.history.push({ row, col, player: this.currentPlayer });
    newGame.moveCount++;
    
    if (this.checkWinner(row, col, this.currentPlayer)) {
      newGame.winner = this.currentPlayer;
      newGame.isGameOver = true;
    } else if (newGame.moveCount === this.ROWS * this.COLS) {
      newGame.isGameOver = true;
    } else {
      newGame.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
    }
    return newGame;
  }

  findEmptyRow(col) {
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (!this.board[row][col]) return row;
    }
    return -1;
  }

  checkWinner(row, col, player) {
    const directions = [[0,1], [1,0], [1,1], [1,-1]];
    for (const [dx, dy] of directions) {
      let count = 1;
      for (let dir = -1; dir <= 1; dir += 2) {
        for (let step = 1; step < 4; step++) {
          const newRow = row + dx * step * dir;
          const newCol = col + dy * step * dir;
          if (newRow < 0 || newRow >= this.ROWS || newCol < 0 || newCol >= this.COLS) break;
          if (this.board[newRow][newCol] === player) count++;
          else break;
        }
      }
      if (count >= 4) return true;
    }
    return false;
  }

  isValidMove(col) {
    if (this.isGameOver) return false;
    return this.findEmptyRow(col) !== -1;
  }

  undo() {
    if (this.history.length === 0) return null;
    const newGame = this.clone();
    const lastMove = newGame.history.pop();
    newGame.board[lastMove.row][lastMove.col] = null;
    newGame.currentPlayer = lastMove.player;
    newGame.winner = null;
    newGame.isGameOver = false;
    newGame.moveCount--;
    return newGame;
  }
}

// ============================================
// 🎨 Rendu
// ============================================

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cellSize = 80;
    this.radius = 30;
    this.game = null;
  }

  setGame(game) {
    this.game = game;
  }

  drawBoard() {
    const ctx = this.ctx;
    const { ROWS, COLS } = this.game;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * this.cellSize + this.cellSize / 2;
        const y = row * this.cellSize + this.cellSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#16213e';
        ctx.fill();
        ctx.strokeStyle = '#0f3460';
        ctx.lineWidth = 2;
        ctx.stroke();
        const player = this.game.board[row][col];
        if (player) {
          this.drawPiece(x, y, player);
        }
      }
    }
  }

  drawPiece(x, y, player) {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(x-10, y-10, 5, x, y, this.radius);
    if (player === 'red') {
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(1, '#c0392b');
    } else {
      gradient.addColorStop(0, '#feca57');
      gradient.addColorStop(1, '#f39c12');
    }
    ctx.beginPath();
    ctx.arc(x, y, this.radius - 5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  highlight(col) {
    const ctx = this.ctx;
    const x = col * this.cellSize + this.cellSize / 2;
    ctx.beginPath();
    ctx.arc(x, 30, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();
  }
}

// ============================================
// 🎮 Contrôleur
// ============================================

const canvas = document.getElementById('gameCanvas');
const renderer = new Renderer(canvas);

let game = new Game();

renderer.setGame(game);
renderer.drawBoard();

// ============================================
// 🖱️ Interactions
// ============================================

canvas.addEventListener('click', (e) => {
  if (!game || game.isGameOver) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (e.clientX - rect.left) * scaleX;
  const col = Math.floor(x / 80);
  handleMove(col);
});

canvas.addEventListener('mousemove', (e) => {
  if (!game || game.isGameOver) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (e.clientX - rect.left) * scaleX;
  const col = Math.floor(x / 80);
  if (col >= 0 && col < 7) {
    renderer.drawBoard();
    renderer.highlight(col);
  }
});

canvas.addEventListener('mouseleave', () => {
  renderer.drawBoard();
});

function handleMove(col) {
  if (!game.isValidMove(col)) return;
  const newGame = game.dropToken(col);
  if (!newGame) return;
  game = newGame;
  renderer.setGame(game);
  renderer.drawBoard();
  updateUI();
}

function newGame() {
  game = new Game();
  renderer.setGame(game);
  renderer.drawBoard();
  updateUI();
}

function updateUI() {
  const turnElement = document.getElementById('current-turn');
  if (game.isGameOver) {
    if (game.winner) {
      turnElement.textContent = `🏆 ${game.winner === 'red' ? '🔴 Rouge' : '🟡 Jaune'} gagne !`;
    } else {
      turnElement.textContent = '🤝 Match nul !';
    }
  } else {
    turnElement.textContent = `Tour : ${game.currentPlayer === 'red' ? '🔴 Rouge' : '🟡 Jaune'}`;
  }
}

// ============================================
// 🔘 Boutons
// ============================================

document.getElementById('reset-btn').addEventListener('click', newGame);