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

const elementToGrid = (element) => {
  let gridColumn;
  let gridRow;
  for (let i = 0; i < 9; i++){
    if (element.parentNode.children[i] === element) gridColumn = i;
    if (document.querySelector('table').children[i] === element.parentNode) gridRow = i;
  }
  return grid[gridRow][gridColumn];
}

const tileReveal = (event) => {
  let gridObject = elementToGrid(event.target);
  if (event.button == 0){
    if(gridObject.isFlagged === false){
      if (gridObject.isBomb === true) {
        console.log(`You hit a bomb!`);
        for (let row = 0; row < 9; row++) {
          for (let column = 0; column < 9; column++) {
            document.querySelectorAll('tr')[row].children[column].removeEventListener('click', tileReveal);
          }
        }
      }
    }
  }
  if (event.button == 2){
    if (gridObject.isFlagged === false){
      gridObject.isFlagged = true;
      event.target.textContent = "f";
    }else{
      gridObject.isFlagged = false;
      event.target.textContent = "";
    }
  }
}

drawGrid();
