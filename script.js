/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */

const Player = (sign) => {
  this.sign = sign;

  const getSign = () => sign;
  return { getSign };
};
const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index > board.length) return;
    // eslint-disable-next-line consistent-return
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { setField, getField, reset };
})();

const displayController = (() => {
  const fieldElements = document.querySelectorAll('.cell');
  const messageElement = document.querySelector('.winning-message');
  const restartButton = document.querySelector('.resetButton');

  fieldElements.forEach((field) => field.addEventListener('click', (e) => {
    if (gameController.getIsOver() || e.target.textContent !== '') return;
    gameController.playRound(parseInt(e.target.dataset.index, 10));
    updateGameboard();
  }));

  restartButton.addEventListener('click', () => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
  });

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === 'Draw') {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
  const playerX = Player('X');
  const playerO = Player('O');
  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());
    if (checkWinner(fieldIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage('Draw');
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(
      `Player ${getCurrentPlayerSign()}'s turn`,
    );
  };

  const getCurrentPlayerSign = () => (round % 2 === 1 ? playerX.getSign() : playerO.getSign());

  const checkWinner = (fieldIndex) => {
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

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) => possibleCombination.every(
        (index) => gameBoard.getField(index) === getCurrentPlayerSign(),
      ));
  };

  const getIsOver = () => isOver;

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };
})();
