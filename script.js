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

const tileReveal = (event) => {
  console.log("testeetatsetse");
  if (event.button == 2){
    console.log(event.target);
  }
  if (grid[0][0].isBomb === true) {
    console.log(`You hit a bomb at cell 0, 0`);
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        document.querySelectorAll('tr')[row].childNodes[column].removeEventListener('click', tileReveal);
      }
    }
  }
}

drawGrid();
