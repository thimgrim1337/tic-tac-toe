'use strict';
const Player = (sign) => {
  const _sign = sign;
  let _wins = 0;

  const getSign = () => _sign;
  const setWins = () => _wins++;
  const getWins = () => _wins;

  return { getSign, getWins, setWins };
};

const minimaxAiLogic = ((aiMode) => {
  let aiPrec = aiMode;
  const setAiPrec = (aiMode) => (aiPrec = aiMode);
  const getAiPrec = () => aiPrec;

  const chooseField = () => {
    const value = Math.floor(Math.random() * (100 + 1));
    console.log(value);

    let choice = null;
    if (value <= aiPrec) {
      choice = bestMove();
    } else {
      const availSpots = gameBoard.getAvailMoves();
      let move = Math.floor(Math.random() * availSpots.length);
      choice = availSpots[move];
    }
    return choice;
  };

  const bestMove = () => {
    console.log(
      minimax(gameBoard.getBoard(), gameController.getAiPlayer().getSign())
        .index
    );
    return minimax(gameBoard.getBoard(), gameController.getAiPlayer().getSign())
      .index;
  };

  const minimax = (newBoard, player) => {
    let availSpots = gameBoard.getAvailMoves();

    if (
      gameController.checkWinner(
        newBoard,
        gameController.getHumanPlayer().getSign()
      )
    ) {
      return { score: -10 };
    } else if (
      gameController.checkWinner(
        newBoard,
        gameController.getAiPlayer().getSign()
      )
    ) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    let moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == gameController.getAiPlayer().getSign()) {
        const result = minimax(
          newBoard,
          gameController.getHumanPlayer().getSign()
        );
        move.score = result.score;
      } else {
        const result = minimax(
          newBoard,
          gameController.getAiPlayer().getSign()
        );
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    let bestMove;
    if (player === gameController.getAiPlayer().getSign()) {
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
  };

  return {
    chooseField,
    bestMove,
    getAiPrec,
    setAiPrec,
  };
})(100);

const gameBoard = (() => {
  let _board = Array.from(Array(9).keys());

  const getBoard = () => _board;
  const setField = (index, player) => (_board[index] = player);

  const clearGameboard = () => {
    for (let i = 0; i < _board.length; i++) _board[i] = i;
  };

  const getAvailMoves = () => {
    return _board.filter((s) => typeof s == 'number');
  };

  return {
    getBoard,
    setField,
    clearGameboard,
    getAvailMoves,
  };
})();

const gameController = (() => {
  const _human = Player('X');
  const _ai = Player('O');

  const getHumanPlayer = () => _human;
  const getAiPlayer = () => _ai;

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

  const getWinCondition = (index) => winConditions[index];

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
    if (gameBoard.getAvailMoves().length == 0) {
      return true;
    }
    return false;
  };

  return {
    getHumanPlayer,
    getAiPlayer,
    checkWinner,
    checkTie,
    getWinCondition,
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

  const human = gameController.getHumanPlayer();
  const ai = gameController.getAiPlayer();

  function startGame() {
    cells.forEach((cell) => cell.addEventListener('click', cellClicked));
    resetBtn.addEventListener('click', restartGame);
    // turnDisplay.textContent = `${currentPlayer}'s turn`;
  }

  function cellClicked(e) {
    const cellIndex = e.target.getAttribute('cell-index');
    if (typeof gameBoard.getBoard()[cellIndex] != 'number') return;
    turn(cellIndex, human.getSign());
    if (
      !gameController.checkWinner(gameBoard.getBoard(), human.getSign()) &&
      !gameController.checkTie()
    )
      turn(minimaxAiLogic.chooseField(), ai.getSign());
  }

  function turn(index, player) {
    gameBoard.setField(index, player);
    cells[index].textContent = player;

    let gameResult = gameController.checkWinner(gameBoard.getBoard(), player);

    if (gameResult || gameController.checkTie()) endGame(gameResult);
  }

  function endGame(gameResult) {
    showResult(gameResult);

    cells.forEach((cell) => cell.removeEventListener('click', cellClicked));
  }

  function showResult(gameResult) {
    if (gameController.checkTie()) {
      showWinner('TIE GAME!');
      return;
    }

    for (let index of gameController.getWinCondition(gameResult.index)) {
      document.querySelector(`[cell-index="${index}"]`).style.color = 'red';
    }

    showWinner(gameResult.player == human.getSign() ? 'You win!' : 'You lost!');
    updateScore(gameResult);
    showScore();
  }

  function showWinner(winner) {
    turnDisplay.textContent = '';
    resultDispay.textContent = winner;
  }

  function updateScore(gameResult) {
    gameResult.player === human.getSign() ? human.setWins() : ai.setWins();
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
    resultDispay.textContent = '';
    gameBoard.clearGameboard();
    startGame();
  }

  startGame();
})();
