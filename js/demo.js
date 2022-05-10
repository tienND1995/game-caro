// * Global avariables
const TURN = {
  CROSS: 'cross',
  CIRCLE: 'circle',
};

const CELL_VALUE = {
  CROSS: 'X',
  CIRCLE: 'O',
  WIN: 'win',
};

const GAME_STATUS = {
  PLAYING: 'PLAYING',
  ENDED: 'END',
  X_WIN: 'X win',
  O_WIN: 'O win',
};

let turnXO = TURN.CROSS;
let turn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

// todo logic games
function checkGameStatus(cellList) {
  if (!Array.isArray(cellList) || cellList.length !== 9) return;

  const checkList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const winElementCheckList = checkList.find((x) => {
    const first = cellList[x[0]];
    const sencond = cellList[x[1]];
    const third = cellList[x[2]];

    return first !== '' && first === sencond && sencond === third;
  });

  if (winElementCheckList !== undefined) {
    return {
      status:
        cellList[winElementCheckList[1]] === CELL_VALUE.CROSS
          ? GAME_STATUS.X_WIN
          : GAME_STATUS.O_WIN,
      winElementList: winElementCheckList,
    };
  }

  const isEndGame = cellList.find((x) => x === '');
  return {
    status: isEndGame === undefined ? GAME_STATUS.ENDED : GAME_STATUS.PLAYING,
    winElementList: [],
  };
}

// todo handle when click

function handleCellClick() {
  const liList = document.querySelectorAll('#cellList > li');
  liList.forEach((li, index) => {
    li.addEventListener('click', () => {
      // update li DOM, current turn
      const isClicked = li.className !== '';
      if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

      li.classList.add(turnXO);

      // add value for cell element list
      cellValues[index] =
        turnXO === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

      turnXO = turnXO === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

      const currentTurnElement = document.getElementById('currentTurn');
      if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(turnXO);
      }

      // check status games
      const games = checkGameStatus(cellValues);

      // update when status changed
      switch (games.status) {
        case GAME_STATUS.ENDED: {
          gameStatus = games.status;
          const statusDom = document.getElementById('gameStatus');
          statusDom.textContent = gameStatus;

          const replayButton = document.getElementById('replayGame');
          replayButton.classList.add('show');
        }
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN: {
          gameStatus = games.status;
          const statusDom = document.getElementById('gameStatus');
          statusDom.textContent = gameStatus;

          const replayButton = document.getElementById('replayGame');
          replayButton.classList.add('show');

          if (
            !Array.isArray(
              games.winElementList || games.winElementList.length === 0
            )
          )
            return;
          for (const index of games.winElementList) {
            const liWin = document.querySelector(
              `#cellList > li:nth-child(${index + 1})`
            );
            liWin.classList.add('win');
          }
        }

        default:
      }
    });
  });
}

// * reset games
function resetGames() {
  turn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');

  const liElementList = document.querySelectorAll('#cellList > li');
  liElementList.forEach((li) => {
    li.className = '';
  });

  const statusGames = document.getElementById('gameStatus');
  statusGames.textContent = gameStatus;

  const turnXO = document.getElementById('currentTurn');
  turnXO.classList.remove(TURN.CROSS, TURN.CIRCLE);
  turnXO.classList.add(turn);

  const replayButton = document.getElementById('replayGame');
  replayButton.classList.remove('show');
}

// * replay games
function replayButton() {
  const replayBtn = document.getElementById('replayGame');
  if (!replayBtn) return;

  replayBtn.addEventListener('click', resetGames);
}

// todo Main
(() => {
  handleCellClick();
  checkGameStatus();
  replayButton();
})();
