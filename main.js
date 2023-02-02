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

  const updateGameboard = (index, sign) => {
    gameboard[index] = sign;
  };

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
          return roundWon;
        }
      }
    }

    if (!gameboard.includes(undefined) && roundWon === false) return 'TIE';
  };

  return {
    gameboard,
    updateGameboard,
    checkWinner,
    clearGameboard,
  };
})();

const displayController = (() => {
  const fields = document.querySelectorAll('.field');
  const result = document.querySelector('.result');
  const turn = document.querySelector('.turn');
  const xscore = document.querySelector('.x-score');
  const oscore = document.querySelector('.o-score');
  const resetBtn = document.querySelector('.reset-btn');
  let currentPlayer = playerX.sign;
  let activeGame = false;

  function startGame() {
    fields.forEach((field) => field.addEventListener('click', fieldClicked));
    turn.textContent = `${currentPlayer}'s turn`;
    activeGame = !activeGame;
    resetBtn.addEventListener('click', restartGame);
  }

  function fieldClicked(e) {
    e.target.textContent = currentPlayer;
    turn.textContent = `${currentPlayer}'s turn`;
    e.target.removeEventListener('click', fieldClicked);
    game.updateGameboard(e.target.dataset.index, e.target.textContent);
    if (game.checkWinner()) showResult();
    if (activeGame) changePlayer();
  }

  function changePlayer() {
    currentPlayer === playerX.sign
      ? (currentPlayer = playerO.sign)
      : (currentPlayer = playerX.sign);
  }

  function showResult() {
    result.textContent =
      game.checkWinner() === true ? `${currentPlayer} wins` : 'TIE';
    currentPlayer === 'X' ? playerX.addWins() : playerO.addWins();
    xscore.textContent = playerX.getWins();
    oscore.textContent = playerO.getWins();
    fields.forEach((field) => field.removeEventListener('click', fieldClicked));
    turn.textContent = '';
    activeGame = !activeGame;
  }

  function restartGame() {
    fields.forEach((field) => (field.textContent = ''));
    changePlayer();
    turn.textContent = currentPlayer;
    result.textContent = '';
    game.clearGameboard();
    startGame();
  }

  startGame();
})();
