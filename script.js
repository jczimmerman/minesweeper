let grid = [];

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
    cell.addEventListener("mousedown", tileReveal);
  }
  document.querySelector('table').appendChild(tableRow);
}

function tileReveal(event) {
  event.preventDefault();
  if (event.button == 2){
    console.log("right");
  }
}
