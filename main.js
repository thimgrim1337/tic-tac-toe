'use strict';
/* const Player = (playerSign) => {
  const sign = playerSign;
  let wins = 0;

  const getWins = () => wins;
  const addWins = () => wins++;

  const bestMove = () => {
    return minimax(game.gameboard, sign);
  };

  return { sign, getWins, addWins, bestMove };
};
 */

const gameController = (() => {
  const human = 'O';
  const ai = 'X';
  const origBoard = Array.from(Array(9).keys());
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const updateGameboard = (index, sign) => (origBoard[index] = sign);

  const clearGameboard = () => origBoard.fill('');

  const checkWinner = (board, player) => {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    let gameWon = null;
    for (let [index, win] of winConditions.entries()) {
      if (win.every((elem) => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  };

  const checkTie = () => {
    if (availableMoves().length == 0) {
      return true;
    }
    return false;
  };

  const availableMoves = () => {
    return origBoard.filter((s) => typeof s == 'number');
  };

  const bestMove = () => {
    return minimax(origBoard, ai).index;
  };

  function minimax(newBoard, player) {
    let availSpots = availableMoves();

    if (checkWinner(newBoard, human)) {
      return { score: -10 };
    } else if (checkWinner(newBoard, ai)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == ai) {
        const result = minimax(newBoard, human);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, ai);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if (player === ai) {
      var bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }

  return {
    origBoard,
    winConditions,
    updateGameboard,
    checkWinner,
    checkTie,
    clearGameboard,
    human,
    ai,
    bestMove,
  };
})();

const displayController = (() => {
  const cells = document.querySelectorAll('.cell');
  const resultDispay = document.querySelector('.result');
  const turnDisplay = document.querySelector('.turn');
  const xscoreDisplay = document.querySelector('.x-score');
  const oscoreDisplay = document.querySelector('.o-score');
  const settings = document.querySelectorAll('.settings div');
  const resetBtn = document.querySelector('.reset-btn');
  const startBtn = document.querySelector('.start-btn');

  let running = false;

  function startGame() {
    cells.forEach((cell) => cell.addEventListener('click', cellClicked));
    resetBtn.addEventListener('click', restartGame);
    // turnDisplay.textContent = `${currentPlayer}'s turn`;
    running = true;
  }

  function cellClicked(e) {
    const cellIndex = e.target.getAttribute('cell-index');
    if (
      typeof gameController.origBoard[cellIndex] != 'number' ||
      running != true
    )
      return;
    turn(cellIndex, gameController.human);
    if (
      !gameController.checkWinner(
        gameController.origBoard,
        gameController.human
      ) &&
      !gameController.checkTie()
    )
      turn(gameController.bestMove(), gameController.ai);
  }

  function turn(index, player) {
    gameController.updateGameboard(index, player);
    cells[index].textContent = player;

    let gameResult = gameController.checkWinner(
      gameController.origBoard,
      player
    );
    if (gameResult) endGame(gameResult);
  }

  function endGame(gameResult) {
    running = false;
    showResult(gameResult);
    // updateScore(gameResult);
    // showScore();
    cells.forEach((cell) => cell.removeEventListener('click', cellClicked));
  }

  function showResult(gameResult) {
    if (gameResult == 'TIE') {
      showWinner('TIE GAME!');
      return;
    }
    for (let index of gameController.winConditions[gameResult.index]) {
      document.querySelector(`[cell-index="${index}"]`).style.color = 'red';
    }
    showWinner(
      gameResult.player == gameController.human ? 'You win!' : 'You lost!'
    );
  }

  function showWinner(winner) {
    turnDisplay.textContent = '';
    resultDispay.textContent = winner;
  }

  function updateScore(gameResult) {
    gameResult.player === 'X' ? human.addWins() : ai.addWins();
  }

  function showScore() {
    xscoreDisplay.textContent = human.getWins();
    oscoreDisplay.textContent = ai.getWins();
  }

  function restartGame() {
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.style.color = '#fff';
    });
    turnDisplay.textContent = currentPlayer;
    resultDispay.textContent = '';
    gameController.clearGameboard();
    startGame();
  }

  startGame();
})();
