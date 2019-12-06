let grid = [];
let size = 9;
let bombTotal = 12;

const drawGrid = () => {
  for (row = 0; row < size; row++) {
    let tableRow = document.createElement('tr');
    grid.push([]);
    for (column = 0; column < size; column++) {
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
    }
    document.querySelector('table').appendChild(tableRow);
  }
}



const elementToGrid = (element) => {
  let gridColumn;
  let gridRow;
  for (let i = 0; i < size; i++) {
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

const firstClick = (gridObject) => {
  let row = grid.findIndex(array => array.includes(gridObject));
  let column = grid[row].indexOf(gridObject);
  for (let y = -1; y <= 1; y++) {
    if (grid[row + y] !== undefined) {
      for (let x = -1; x <= 1; x++) {
        if ((grid[row + y][column + x] !== undefined) && (grid[row + y][column + x].isBomb)) {
          grid[row + y][column + x].isBomb = false;
          bombPlacement(size, 1);
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
        if ((grid[row + y][column + x] !== undefined)) {
          let elementObject = document.querySelectorAll('tr')[row + y].children[column + x];
          elementObject.textContent = bombCheck(grid[row + y][column + x]) === 0 ? ' ' : bombCheck(grid[row + y][column + x]);
          elementObject.removeEventListener('mousedown', tileReveal);
          elementObject.classList.add('selected');
          if ((elementObject.textContent === ' ') && (grid[row + y][column + x].expanded === false)){
            grid[row + y][column + x].expanded = true;
            expand(grid[row + y][column + x]);
          }
        }
      }
    }
  }
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

  const timer = () =>{
    timerCounter += 1;
    let timerEl = document.querySelector(".timer");
    timerEl.textContent = timerCounter.toString().padStart(3, 0);
  }

  if (event.button == 0) {
    if (first === true) {
      bombPlacement(size, bombTotal);
      firstCheck();
      intervalId = setInterval(timer, 1000);
    }
    if (gridObject.isFlagged === false) {
      event.target.removeEventListener("mousedown", tileReveal);
      if (gridObject.isBomb === true) {
        for (let row = 0; row < size; row++) {
          for (let column = 0; column < size; column++) {
            let square = document.querySelectorAll('tr')[row].children[column]
            square.removeEventListener('mousedown', tileReveal);
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
        event.target.classList.add('selected');
        event.target.textContent = bombCheck(gridObject) === 0 ? ' ' : bombCheck(gridObject);
        if (event.target.textContent === ' ') expand(elementToGrid(event.target));
      }
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
    clearInterval(intervalId);
    let message = document.createElement('p');
    message.textContent = 'You win!';
    document.body.appendChild(message);
    for (let i = 0; i < document.querySelectorAll('td').length; i++) {
      document.querySelectorAll('td')[i].removeEventListener('mousedown', tileReveal);
    }
  }
}

let dropDown = document.getElementById('difficulty');
dropDown.addEventListener('input', event => {
  if (confirm('This will reset the current game.\nIs that okay?')) {
    if (dropDown.selectedIndex === 0) {
      size = 9;
      bombTotal = 12;
    } else if (dropDown.selectedIndex === 1) {
      size = 12;
      bombTotal = 40;
    } else if (dropDown.selectedIndex === 2) {
      size = 20;
      bombTotal = 60;
    }
    resetboi();
  }
})
drawGrid();

const bombPlacement = (size, amt) => {
  let counter = 0;
  for (bombz = 0; bombz < amt; bombz++) {
    let x = Math.floor(Math.random() * Math.floor(size));
    let y = Math.floor(Math.random() * Math.floor(size));
    if (grid[x][y].isBomb !== true) {
      grid[x][y].isBomb = true;
    }
    else{
      counter++;
    }
  }
  if (counter !== 0) bombPlacement(size, counter);
}

//for testing purposes
const win = () => {
  bombPlacement(size, bombTotal);
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      document.querySelectorAll('tr')[row].children[column].textContent = bombCheck(grid[row][column]);
      if (grid[row][column].isBomb) {
        grid[row][column].isFlagged = true;
        document.querySelectorAll('tr')[row].children[column].textContent = "🚩";
      }
    }
  }
  if (gameWon(grid, document.querySelectorAll('td'))) {
    clearInterval(intervalId);
    let message = document.createElement('p');
    message.textContent = 'You win!';
    document.body.appendChild(message);
    for (let i = 0; i < document.querySelectorAll('td').length; i++) {
      document.querySelectorAll('td')[i].removeEventListener('mousedown', tileReveal);
    }
  }
}

const clearboi = (element) => {
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
}

const resetboi = () => {
  clearInterval(intervalId);
  timerCounter = 0;
  document.querySelector(".timer").textContent = timerCounter.toString().padStart(3, 0);
  let tableEl=document.querySelector('table');
  for(i=0; i < 9; i++){
    grid.pop([]);
  }
  first = true;
  clearboi(tableEl);
  drawGrid();
}

let buttonEl = document.querySelector('button');
buttonEl.addEventListener('click', resetboi);
