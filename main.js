'use strict';
const Player = (playerSign) => {
  const sign = playerSign;
  let wins = 0;

  const getWins = () => wins;
  const addWins = () => wins++;
  const makeMove = () => {
    const rnd = Math.floor(Math.random() * game.gameboard.length);
    if (game.gameboard[rnd] == '') {
      displayController.updateCell(rnd);
    } else makeMove();
  };

  return { sign, getWins, addWins, makeMove };
};

const human = Player('X');
const ai = Player('O');

const game = (() => {
  const gameboard = ['', '', '', '', '', '', '', '', ''];
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [3, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const updateGameboard = (index, sign) => (gameboard[index] = sign);

  const clearGameboard = () => gameboard.fill('');

  const checkWinner = () => {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
      let a = gameboard[winConditions[i][0]];
      let b = gameboard[winConditions[i][1]];
      let c = gameboard[winConditions[i][2]];
      if (a != '' && b != '' && c != '') {
        if (a === b && b === c) {
          roundWon = true;
        }
      }
    }

    if (roundWon) {
      return true;
    } else if (!gameboard.includes('')) {
      return 'TIE';
    } else displayController.changePlayer();
  };

  return {
    gameboard,
    updateGameboard,
    checkWinner,
    clearGameboard,
  };
})();

const displayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const result = document.querySelector('.result');
  const turn = document.querySelector('.turn');
  const xscore = document.querySelector('.x-score');
  const oscore = document.querySelector('.o-score');
  const settings = document.querySelectorAll('.settings div');
  const resetBtn = document.querySelector('.reset-btn');
  const startBtn = document.querySelector('.start-btn');

  let currentPlayer = human.sign;
  let running = false;

  function startGame() {
    cells.forEach((cell) => cell.addEventListener('click', cellClicked));
    resetBtn.addEventListener('click', restartGame);
    turn.textContent = `${currentPlayer}'s turn`;
    running = true;
  }

  function cellClicked(e) {
    const cellIndex = e.target.getAttribute('cell-index');
    if (game.gameboard[cellIndex] != '' || !running) return;
    updateCell(cellIndex);
    if (currentPlayer == ai.sign) ai.makeMove();
  }

  function updateCell(index) {
    game.updateGameboard(index, currentPlayer);
    cells[index].textContent = currentPlayer;
    if (game.checkWinner()) showResult(game.checkWinner());
  }

  function changePlayer() {
    currentPlayer = currentPlayer == human.sign ? ai.sign : human.sign;
    turn.textContent = `${currentPlayer}'s turn`;
  }

  function updateScore(gameResult) {
    if (gameResult == 'TIE') return;
    currentPlayer === 'X' ? human.addWins() : ai.addWins();
  }

  function showScore() {
    xscore.textContent = human.getWins();
    oscore.textContent = ai.getWins();
  }

  function showResult(gameResult) {
    updateScore(gameResult);
    showScore();
    result.textContent = gameResult == 'TIE' ? 'TIE' : `${currentPlayer} wins`;
    turn.textContent = '';
    running = false;
  }

  function restartGame() {
    cells.forEach((cell) => (cell.textContent = ''));
    turn.textContent = currentPlayer;
    result.textContent = '';
    game.clearGameboard();
    startGame();
  }

  startGame();

  return {
    changePlayer,
    updateCell,
  };
})();
