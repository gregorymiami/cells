const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.canvas.width = 1010;
context.canvas.height = 1010;
context.fillStyle = 'white';
context.lineWidth = 1;
context.fillRect(0, 0, context.canvas.width, context.canvas.height);
context.strokeStyle = 'black';
context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
let { width, height } = canvas.getBoundingClientRect();
let cell_dims = 10;
let rows = height / cell_dims;
let columns = width / cell_dims;
let grid_data = {}
console.log(`width: ${width} and height: ${height}`);

let convertToHtmlX = (x) => {
  return (x + Math.round(width / 2));
}

let convertToHtmlY = (y) => {
  return (Math.round(height / 2) + (-y));
}

let drawCircle = (x, y, color, radius) => {
  let realX = convertToHtmlX(x);
  let realY = convertToHtmlY(y);
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(realX, realY, radius, radius, 0, 0, Math.PI * 2);
  context.stroke();
  console.log("done");
}

let clearCanvas = () => {
  context.fillStyle = 'white';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

let drawRect = (x, y, color, width, height) => {
  context.strokeStyle = color;
  context.strokeRect(x, y, width, height);
}

let drawRectFill = (x, y, color, width, height) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

let getTopRight = (row, column) => {
  return { x: (row - 1) * 10, y: (column - 1) * 10 };
}

let drawCell = (row, column, color) => {
  let { x, y } = getTopRight(row, column);
  drawRectFill(y, x, color, cell_dims, cell_dims); 
}

let drawCellWall = (row, column, color) => {
  let { x, y } = getTopRight(row, column);
  drawRect(y, x, color, cell_dims, cell_dims); 
}

let drawGrid = () => {
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= columns; j++) {
      drawCellWall(i, j, "black");
    }
  }
}

let setCell = (row, column, color) => {
  grid_data[`${row}:${column}`] = "black";
}

let unsetCell = (row, column) => {
  delete grid_data[`${row}:${column}`];
}

let drawAutomota = () => {
  for (const [key, value] of Object.entries(grid_data)) {
    let coordinates = key.split(':');
    drawCell(parseInt(coordinates[0]), parseInt(coordinates[1]), value);
  }  
}

class GameOfLife {
  countNeighbors(row, column, grid) {
    let count = 0;

    if (`${row - 1}:${column - 1}` in grid) {
      count++;
    }

    if (`${row - 1}:${column}` in grid) {
      count++;
    }

    if (`${row - 1}:${column + 1}` in grid) {
      count++;
    }

    if (`${row}:${column - 1}` in grid) {
      count++;
    }

    if (`${row}:${column + 1}` in grid) {
      count++;
    }

    if (`${row + 1}:${column - 1}` in grid) {
      count++;
    }

    if (`${row + 1}:${column}` in grid) {
      count++;
    }

    if (`${row + 1}:${column + 1}` in grid) {
      count++;
    }

    return count;
  }

  getUpdate(rows, columns, grid) {
    let updated_grid = {};

    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= columns; j++) {
        let neighborCount = this.countNeighbors(i, j, grid);
        let isAlive = `${i}:${j}` in grid;

        if ((isAlive && (neighborCount === 2 || neighborCount === 3)) || (!isAlive && neighborCount === 3)) {
          updated_grid[`${i}:${j}`] = "black";
        }
      }
    }
    return updated_grid;
  }
}

let gameOfLife = new GameOfLife();
drawGrid();
setCell(51, 51, "black");
setCell(52, 51, "black");
setCell(53, 51, "black");
setCell(51, 52, "black");
setCell(52, 50, "black");
drawAutomota();

setInterval(() => {
  grid_data = gameOfLife.getUpdate(rows, columns, grid_data);
  clearCanvas();
  drawGrid();
  drawAutomota();
}, 80);