'use strict';
const Player = (playerName, playerSign) => {
  const name = playerName;
  const sign = playerSign;
  let wins = 0;

  const getWins = () => wins;
  const addWins = () => wins++;

  return { name, sign, getWins, addWins };
};

const playerX = Player('Dawid', 'X');
const playerO = Player('CPU', 'O');

const game = (() => {
  const gameboard = new Array(9);
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

  const clearGameboard = () => gameboard.fill(undefined);

  const checkWinner = () => {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
      let a = gameboard[winConditions[i][0]];
      let b = gameboard[winConditions[i][1]];
      let c = gameboard[winConditions[i][2]];
      if (a != undefined && b != undefined && c != undefined) {
        if (a === b && b === c) {
          roundWon = true;
        }
      }
    }

    if (roundWon) {
      return true;
    } else if (!gameboard.includes(undefined) && roundWon === false) {
      return 'TIE';
    } else return false;
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

  let currentPlayer = playerX.sign;
  let running = false;
  /*   function setActive(e) {
    const clickedOption = e.target;
    const otherOption = [...settings].filter(
      (setting) => setting !== clickedOption
    );
    otherOption.forEach((option) => option.classList.remove('active'));
    clickedOption.classList.add('active');
  } */

  function startGame() {
    cells.forEach((cell) => cell.addEventListener('click', cellClicked));
    resetBtn.addEventListener('click', restartGame);
    turn.textContent = `${currentPlayer}'s turn`;
    running = true;
  }

  function cellClicked(e) {
    const cellIndex = e.target.getAttribute('cell-index');
    if (game.gameboard[cellIndex] != undefined || !running) return;
    updateCell(e.target, cellIndex);
    if (!game.checkWinner()) changePlayer();
    else showResult(game.checkWinner());
  }

  function updateCell(cell, index) {
    game.updateGameboard(index, currentPlayer);
    cell.textContent = currentPlayer;
  }

  function changePlayer() {
    currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
    turn.textContent = `${currentPlayer}'s turn`;
  }

  function updateScore(gameResult) {
    if (gameResult == 'TIE') return;
    currentPlayer === 'X' ? playerX.addWins() : playerO.addWins();
  }

  function showScore() {
    xscore.textContent = playerX.getWins();
    oscore.textContent = playerO.getWins();
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
    changePlayer();
    turn.textContent = currentPlayer;
    result.textContent = '';
    game.clearGameboard();
    startGame();
  }

  startGame();
})();
