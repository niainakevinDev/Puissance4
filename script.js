// ============================================
// 🎮 PUISSANCE 4 - Version complète
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
// 🤖 IA
// ============================================

class AI {
  constructor(depth = 4) {
    this.depth = depth;
  }

  getBestMove(game) {
    let bestScore = -Infinity;
    let bestCol = Math.floor(game.COLS / 2);
    for (let col = 0; col < game.COLS; col++) {
      if (!game.isValidMove(col)) continue;
      const newGame = game.dropToken(col);
      if (!newGame) continue;
      const score = this.minimax(newGame, this.depth - 1, -Infinity, Infinity, false);
      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    }
    return bestCol;
  }

  minimax(game, depth, alpha, beta, isMaximizing) {
    if (game.isGameOver || depth === 0) return this.evaluate(game);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let col = 0; col < game.COLS; col++) {
        if (!game.isValidMove(col)) continue;
        const newGame = game.dropToken(col);
        if (!newGame) continue;
        const evalScore = this.minimax(newGame, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let col = 0; col < game.COLS; col++) {
        if (!game.isValidMove(col)) continue;
        const newGame = game.dropToken(col);
        if (!newGame) continue;
        const evalScore = this.minimax(newGame, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  evaluate(game) {
    if (game.winner === 'yellow') return 1000;
    if (game.winner === 'red') return -1000;
    if (game.isGameOver) return 0;

    let score = 0;
    const centerCol = Math.floor(game.COLS / 2);
    for (let row = 0; row < game.ROWS; row++) {
      if (game.board[row][centerCol] === 'yellow') score += 3;
      if (game.board[row][centerCol] === 'red') score -= 3;
    }

    for (let row = 0; row < game.ROWS; row++) {
      for (let col = 0; col < game.COLS; col++) {
        const player = game.board[row][col];
        if (!player) continue;
        const value = player === 'yellow' ? 1 : -1;
        score += this.evaluatePosition(game, row, col, player) * value;
      }
    }
    return score;
  }

  evaluatePosition(game, row, col, player) {
    let score = 0;
    const directions = [[0,1], [1,0], [1,1], [1,-1]];
    for (const [dx, dy] of directions) {
      let count = 1;
      for (let dir = -1; dir <= 1; dir += 2) {
        for (let step = 1; step < 4; step++) {
          const newRow = row + dx * step * dir;
          const newCol = col + dy * step * dir;
          if (newRow < 0 || newRow >= game.ROWS || newCol < 0 || newCol >= game.COLS) break;
          if (game.board[newRow][newCol] === player) count++;
          else break;
        }
      }
      if (count === 3) score += 10;
      else if (count === 2) score += 2;
    }
    return score;
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
const ai = new AI(4);

let game = new Game();
let mode = 'pvp';
let isAIThinking = false;

renderer.setGame(game);
renderer.drawBoard();

// ============================================
// 🖱️ Interactions
// ============================================

canvas.addEventListener('click', (e) => {
  if (isAIThinking || !game || game.isGameOver) return;
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
  if (mode === 'ai' && !game.isGameOver && game.currentPlayer === 'yellow') {
    makeAIMove();
  }
}

function makeAIMove() {
  if (isAIThinking) return;
  isAIThinking = true;
  setTimeout(() => {
    const col = ai.getBestMove(game);
    handleMove(col);
    isAIThinking = false;
  }, 300);
}

function newGame() {
  game = new Game();
  renderer.setGame(game);
  renderer.drawBoard();
  updateUI();
  if (mode === 'ai' && game.currentPlayer === 'yellow') {
    makeAIMove();
  }
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

document.getElementById('ai-btn').addEventListener('click', () => {
  mode = 'ai';
  document.getElementById('ai-btn').classList.add('active');
  document.getElementById('pvp-btn').classList.remove('active');
  newGame();
});

document.getElementById('pvp-btn').addEventListener('click', () => {
  mode = 'pvp';
  document.getElementById('pvp-btn').classList.add('active');
  document.getElementById('ai-btn').classList.remove('active');
  newGame();
});

// Mode par défaut
document.getElementById('pvp-btn').classList.add('active');