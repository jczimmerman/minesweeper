let grid = [];
let height = 9;
let width = 9;
let bombTotal = 12;
let difficulty = 'easy';

const removeAllListeners = target => {
  target.removeEventListener('mousedown', tileReveal);
  target.removeEventListener('touchstart', holdStart);
}

const drawGrid = () => {
  for (row = 0; row < height; row++) {
    let tableRow = document.createElement('tr');
    grid.push([]);
    for (column = 0; column < width; column++) {
      grid[row].push({
        isFlagged: false,
        isBomb: false,
        expanded: false
      })
      let cell = document.createElement('td');
      tableRow.appendChild(cell);
      cell.addEventListener("mousedown", tileReveal)
      cell.addEventListener("contextmenu", event => {
        event.preventDefault();
      });
      cell.addEventListener('touchstart', holdStart);

    }
    document.querySelector('table').appendChild(tableRow);
  }
}

let longHold;
const holdStart = (event) => {
  longHold = false;
  let quickTouch = true;
  event.preventDefault();
  let timeout;
  timeout = setTimeout(() => {
    longHold = true;
    quickTouch = false;
    tileReveal(event);
  }, 300);
  event.target.addEventListener('touchend', () => {
    clearTimeout(timeout);
    if (quickTouch) tileReveal(event);
  });
}

const flagCount = () => {
  let flags = 0;
  for (let array of grid) {
    for (let element of array) {
      if (element.isFlagged) flags++;
    }
  }
  return flags;
}

const flagUpdate = () => {
  document.querySelector('.flagCounter').textContent = bombTotal - flagCount();
}

window.addEventListener('load', event => {
  flagUpdate();
  loadScore();
});

const elementToGrid = (element) => {
  let gridColumn;
  let gridRow;
  for (let x = 0; x < width; x++) {
    if (element.parentNode.children[x] === element) gridColumn = x;
  }
  for (let y = 0; y < height; y++) {
    if (document.querySelector('table').children[y] === element.parentNode) gridRow = y;
  }
  return grid[gridRow][gridColumn];
}

const bombCheck = (cell) => {
  let bombCount = 0;
  let row = grid.findIndex(array => array.includes(cell));
  let column = grid[row].indexOf(cell);
  for (let y = -1; y <= 1; y++) {
    if (grid[row + y] !== undefined) {
      for (let x = -1; x <= 1; x++) {
        if ((grid[row + y][column + x] !== undefined) && (grid[row + y][column + x].isBomb)) bombCount += 1;
      }
    }
  }
  return bombCount;
}

const firstClick = (gridObject) => {
  let row = grid.findIndex(array => array.includes(gridObject));
  let column = grid[row].indexOf(gridObject);
  for (let y = -1; y <= 1; y++) {
    if (grid[row + y] !== undefined) {
      for (let x = -1; x <= 1; x++) {
        if ((grid[row + y][column + x] !== undefined) && (grid[row + y][column + x].isBomb)) {
          grid[row + y][column + x].isBomb = false;
          bombPlacement(height, width, 1);
        };
      }
    }
  }
}

const expand = (gridObject) => {
  let row = grid.findIndex(array => array.includes(gridObject));
  let column = grid[row].indexOf(gridObject);
  for (let y = -1; y <= 1; y++) {
    if (grid[row + y] !== undefined) {
      for (let x = -1; x <= 1; x++) {
        if ((grid[row + y][column + x] !== undefined && grid[row + y][column + x].isFlagged !== true)) {
          grid[row + y][column + x].isFlagged = false;
          let elementObject = document.querySelectorAll('tr')[row + y].children[column + x];
          elementObject.textContent = bombCheck(grid[row + y][column + x]) === 0 ? ' ' : bombCheck(grid[row + y][column + x]);
          removeAllListeners(elementObject);
          elementObject.classList.add('selected', `number${bombCheck(grid[row + y][column + x])}`);
          if ((elementObject.textContent === ' ') && (grid[row + y][column + x].expanded === false)) {
            grid[row + y][column + x].expanded = true;
            expand(grid[row + y][column + x]);
          }
        }
      }
    }
  }
}

const gameWon = (grid, elements) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((elements[y].children[x].textContent === '') && !grid[y][x].isBomb) return false;
      if (grid[y][x].isFlagged && !grid[y][x].isBomb) return false;
    }
  }
  return true;
}

let first = true;
let intervalId;
let timerCounter = 0;

const tileReveal = (event) => {
  let gridObject = elementToGrid(event.target);
  const firstCheck = () => {
    first = false;
    if (bombCheck(gridObject) > 0) {
      firstClick(gridObject);
      firstCheck();
    }
  }

  const timer = () => {
    let timerEl = document.querySelector(".timer");
    timerEl.textContent = timerCounter.toString().padStart(3, 0);
    if (gameWon(grid, document.querySelectorAll('tr'))) {
      clearInterval(intervalId);
    }
    timerCounter < 999 ? timerCounter += 1 : timerCounter = 999;
  }

  if (event.button == 0 || longHold === false) {
    if (first === true) {
      bombPlacement(height, width, bombTotal);
      firstCheck();
      intervalId = setInterval(timer, 1000);
    }
    if (gridObject.isFlagged === false) {
      removeAllListeners(event.target);
      if (gridObject.isBomb === true) {
        for (let row = 0; row < height; row++) {
          for (let column = 0; column < width; column++) {
            let square = document.querySelectorAll('tr')[row].children[column]
            removeAllListeners(square)
            if (grid[row][column].isBomb) {
              square.textContent = '💣';
              square.classList.add('selected');
            }
            if (!grid[row][column].isBomb && grid[row][column].isFlagged) {
              square.textContent = '❌';
              square.classList.add('selected');
            }
          }
        }
        clearInterval(intervalId);
        event.target.textContent = '💥';
      } else {
        event.target.classList.add('selected', `number${bombCheck(gridObject)}`);
        event.target.textContent = bombCheck(gridObject) === 0 ? ' ' : bombCheck(gridObject);
        if (event.target.textContent === ' ') expand(elementToGrid(event.target));
      }
    }
  }
  if (event.button == 2 || longHold === true) {
    if (gridObject.isFlagged === false) {
      gridObject.isFlagged = true;
      event.target.textContent = "🚩";
    } else {
      gridObject.isFlagged = false;
      event.target.textContent = "";
    }
    longHold = undefined;
  }
  if (gameWon(grid, document.querySelectorAll('tr'))) {
    document.querySelector('p.win-message').textContent = 'You win!';
    for (let i = 0; i < document.querySelectorAll('td').length; i++) {
      removeAllListeners(document.querySelectorAll('td')[i]);
    }
    if (difficulty !== 'custom') saveScore(difficulty, timerCounter);
  }
  flagUpdate();
}

let customOpen = false;
let dropDown = document.getElementById('difficulty');
dropDown.addEventListener('input', event => {
  if (dropDown.selectedIndex === 3) {
    difficulty = 'custom';
    loadScore();
    document.getElementById('highscore').style.display = "none";
    if (!customOpen) {
      document.getElementById('custom-menu').style.display = 'flex';
      customOpen = true;
    } else {
      document.getElementById('custom-menu').style.display = 'none';
      customOpen = false;
    }
  } else if (confirm('This will reset the current game.\nDo you want to continue?')) {
    if (dropDown.selectedIndex === 0) {
      height = 9;
      width = 9;
      bombTotal = 12;
      difficulty = 'easy';
      loadScore()
      document.getElementById('highscore').style.display = "flex";
    } else if (dropDown.selectedIndex === 1) {
      height = 12;
      width = 12;
      bombTotal = 20;
      difficulty = 'medium';
      loadScore();
      document.getElementById('highscore').style.display = "flex";
    } else if (dropDown.selectedIndex === 2) {
      height = 20;
      width = 20;
      difficulty = 'hard';
      bombTotal = 80;
      loadScore();
      document.getElementById('highscore').style.display = "flex";
    }
    document.getElementById('custom-menu').style.display = 'none';
    customOpen = false;
    resetboi();
  }
})
drawGrid();

const bombPlacement = (height, width, amt) => {
  let counter = 0;
  for (bombz = 0; bombz < amt; bombz++) {
    let x = Math.floor(Math.random() * Math.floor(width));
    let y = Math.floor(Math.random() * Math.floor(height));
    if (grid[y][x].isBomb !== true) {
      grid[y][x].isBomb = true;
    } else {
      counter++;
    }
  }
  if (counter !== 0) bombPlacement(height, width, counter);
}

const clearboi = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const resetboi = () => {
  clearInterval(intervalId);
  timerCounter = 0;
  document.querySelector(".timer").textContent = timerCounter.toString().padStart(3, 0);
  let tableEl = document.querySelector('table');
  while (grid.length > 0) {
    grid.pop([]);
  }
  first = true;
  document.querySelector('p.win-message').textContent = '';
  clearboi(tableEl);
  drawGrid();
  flagUpdate();
}

const customReset = () => {
  console.log('new game');
  height = Math.floor(Number(document.querySelector('input.height').value));
  if (height < 1) {
    height = 1;
    document.querySelector('input.height').value = 1;
  }
  width = Math.floor(Number(document.querySelector('input.width').value));
  if (width < 9) {
    width = 9;
    document.querySelector('input.width').value = 9;
  }
  bombTotal = Math.floor(Number(document.querySelector('input.bombs').value));
  if (height === 1) {
    if (bombTotal > (height * width) - 3) {
      bombTotal = (height * width) - 3;
      document.querySelector('input.bombs').value = (height * width) - 3;
    }
  } else if (height === 2) {
    if (bombTotal > (height * width) - 6) {
      bombTotal = (height * width) - 6;
      document.querySelector('input.bombs').value = (height * width) - 6;
    }
  } else {
    if (bombTotal > (height * width) - 9) {
      bombTotal = (height * width) - 9;
      document.querySelector('input.bombs').value = (height * width) - 9;
    }
  }
  resetboi();
}

let buttonEl = document.querySelector('button');
buttonEl.addEventListener('click', resetboi);
document.querySelector('#custom-menu button').addEventListener('click', customReset);

//for testing purposes
const colorCheck = () => {
  let row = document.querySelectorAll('td');
  for (let i = 0; i < 9; i++) {
    row[i].textContent = i === 0 ? ' ' : i;
    row[i].classList.add('selected', `number${i}`);
  }
}

const saveScore = (difficulty, score) => {
  if (score < getScore()) {
    document.cookie = `${difficulty}Score=${score};max-age=31536000`;
    loadScore();
  }
}

const loadScore = () => {
  if (difficulty !== 'custom') {
    if (getScore() > 999) {
      document.querySelector('#highscore').textContent = `You currently don't have a highscore for this difficulty!`
    } else {
      document.querySelector('#highscore').textContent = `Highscore: ${getScore()}`;
    }
  }
}

const getScore = () => {
  let currentDifficultyScore = 1000;
  let cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let name = cookieArr[i].split('=');
    name[0] = name[0].trim();
    if (name[0] === difficulty + 'Score') {
      currentDifficultyScore = name[1];
    }
  }
  return parseInt(currentDifficultyScore);
}
