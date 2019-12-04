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
    }
    document.querySelector('table').appendChild(tableRow);
  }
}

<<<<<<< HEAD
=======
const elementToGrid = (element) => {
  let gridColumn;
  let gridRow;
  for (let i = 0; i < 9; i++){
    if (element.parentNode.children[i] === element) gridColumn = i;
    if (document.querySelector('table').children[i] === element.parentNode) gridRow = i;
  }
  return grid[gridRow][gridColumn];
}

>>>>>>> aa8325144d1f6d497cec8b250ed3cb53b710b2a2
const tileReveal = (event) => {
  let gridObject = elementToGrid(event.target);
  console.log("testeetatsetse");
<<<<<<< HEAD
  if (event.button == 2){
    console.log(event.target);
  }
  if (grid[0][0].isBomb === true) {
    console.log(`You hit a bomb at cell 0, 0`);
=======
  if (gridObject.isBomb === true) {
    console.log(`You hit a bomb!`);
>>>>>>> aa8325144d1f6d497cec8b250ed3cb53b710b2a2
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        document.querySelectorAll('tr')[row].children[column].removeEventListener('click', tileReveal);
      }
    }
  }
}

drawGrid();
