let grid = [];

const drawGrid = () => {
  for (row = 0; row < 9; row++) {
    let tableRow = document.createElement('tr');
    grid.push([]);
    for (column = 0; column < 9; column++) {
      grid[row].push({
        isFlagged: false,
        isBomb: false
      })
      let cell = document.createElement('td');
      tableRow.appendChild(cell);
      cell.addEventListener("mousedown", tileReveal)
      cell.addEventListener("contextmenu", event => {
        event.preventDefault();
      });
    }
    document.querySelector('table').appendChild(tableRow);
  }
}

const elementToGrid = (element) => {
  let gridColumn;
  let gridRow;
  for (let i = 0; i < 9; i++) {
    if (element.parentNode.children[i] === element) gridColumn = i;
    if (document.querySelector('table').children[i] === element.parentNode) gridRow = i;
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

const gameWon = (grid, elements) => {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent === '') return false;
  }
  for (let row of grid) {
    for (let cell of row) {
      if (cell.isFlagged && !cell.isBomb) return false;
    }
  }
  return true;
}

const tileReveal = (event) => {
  let gridObject = elementToGrid(event.target);
  if (event.button == 0) {
    if (gridObject.isFlagged === false) {
      event.target.removeEventListener("mousedown", tileReveal);
      if (gridObject.isBomb === true) {
        for (let row = 0; row < 9; row++) {
          for (let column = 0; column < 9; column++) {
            let square = document.querySelectorAll('tr')[row].children[column]
            square.removeEventListener('mousedown', tileReveal);
            if (grid[row][column].isBomb) square.textContent = '💣';
            if (!grid[row][column].isBomb && grid[row][column].isFlagged) square.textContent = '❌';
          }
        }
        event.target.textContent = '💥';
      } else event.target.textContent = bombCheck(gridObject);
    }
  }
  if (event.button == 2) {
    if (gridObject.isFlagged === false) {
      gridObject.isFlagged = true;
      event.target.textContent = "🚩";
    } else {
      gridObject.isFlagged = false;
      event.target.textContent = "";
    }
  }
  if (gameWon(grid, document.querySelectorAll('td'))) {
    let message = document.createElement('p');
    message.textContent = 'You win!';
    document.body.appendChild(message);
    for (let i = 0; i < document.querySelectorAll('td').length; i ++) {
      document.querySelectorAll('td')[i].removeEventListener('mousedown', tileReveal);
    }
  }
}
drawGrid();

function bombPlacement() {
  for (bombz = 0; bombz <= 10; bombz++) {
    let x = Math.floor(Math.random() * Math.floor(9));
    let y = Math.floor(Math.random() * Math.floor(9));
    if (grid[x][y].isBomb !== true) {
      grid[x][y].isBomb = true;
    }
  }
}

//for testing purposes
const win = () => {
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      document.querySelectorAll('tr')[row].children[column].textContent = bombCheck(grid[row][column]);
      if (grid[row][column].isBomb) {
        grid[row][column].isFlagged = true;
        document.querySelectorAll('tr')[row].children[column].textContent = "🚩";
      }
    }
  }
  if (gameWon(grid, document.querySelectorAll('td'))) {
    let message = document.createElement('p');
    message.textContent = 'You win!';
    document.body.appendChild(message);
    for (let i = 0; i < document.querySelectorAll('td').length; i ++) {
      document.querySelectorAll('td')[i].removeEventListener('mousedown', tileReveal);
    }
  }
}

bombPlacement();
