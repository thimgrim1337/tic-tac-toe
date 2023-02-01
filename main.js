'use strict';
const Player = (playerChoice) => {
  const sign = playerChoice;

  return { sign };
};

const player = Player('X');

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

  const checkWinner = () => {
    for (let i = 0; i < winConditions.length; i++) {
      if (
        gameboard[winConditions[i][0]] != undefined &&
        gameboard[winConditions[i][1]] != undefined &&
        gameboard[winConditions[i][2]] != undefined
      ) {
        if (
          gameboard[winConditions[i][0]] === gameboard[winConditions[i][1]] &&
          gameboard[winConditions[i][1]] === gameboard[winConditions[i][2]]
        ) {
          return true;
        }
      }
    }
  };

  return { gameboard, updateGameboard, checkWinner };
})();

const displayController = (() => {
  const fields = document.querySelectorAll('.field');
  const result = document.querySelector('.result');
  const turn = document.querySelector('.turn');
  const resetBtn = document.querySelector('.reset-btn');

  function startGame() {
    fields.forEach((field) => field.addEventListener('click', fieldClicked));
    resetBtn.addEventListener('click', restartGame);
  }

  function fieldClicked(e) {
    e.target.textContent = player.sign;
    e.target.removeEventListener('click', fieldClicked);
    game.updateGameboard(e.target.dataset.index, e.target.textContent);
    if (game.checkWinner() === true) showResult();
    changeSign();
  }

  function changeSign() {
    player.sign === 'X' ? (player.sign = 'O') : (player.sign = 'X');
    turn.textContent = `${player.sign}'s turn`;
  }

  function showResult() {
    result.textContent = `${player.sign} is a winner.`;
    turn.textContent = '';
    fields.forEach((field) => field.removeEventListener('click', fieldClicked));
  }

  function restartGame() {
    location.reload();
  }

  startGame();
})();
