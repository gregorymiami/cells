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

let drawGrid = (algo) => {
  for (let i = 1; i <= algo.rows; i++) {
    for (let j = 1; j <= algo.columns; j++) {
      drawCellWall(i, j, "black");
    }
  }
}

let drawAutomota = (grid_data) => {
  for (const [key, value] of Object.entries(grid_data)) {
    let coordinates = key.split(':');
    drawCell(parseInt(coordinates[0]), parseInt(coordinates[1]), value);
  }  
}

class RockPaperScissors {
  getAlgo(rows, columns, initialConditions, runs) {
    let algo = {};
    algo["rows"] = rows;
    algo["columns"] = columns;
    algo["grid"] = {};
    algo["runs"] = runs;
    for (let index in initialConditions) {
      algo.grid[initialConditions[index].coordinates] = initialConditions[index].color;
    }
    
    return algo;
  }

  // Returns true if the current_color is beaten
  rockPaperScissors(current_color, neighbor_color) {
    return (current_color === "blue" && neighbor_color === "red") || (current_color === "green" && neighbor_color === "blue") || (current_color === "red" && neighbor_color === "green");
  }

  checkNeighbors(row, column, grid) {
    let current_color = grid[`${row}:${column}`];

    if (this.rockPaperScissors(current_color, grid[`${row - 1}:${column - 1}`])) {
      return grid[`${row - 1}:${column - 1}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row - 1}:${column}`])) {
      return grid[`${row - 1}:${column}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row - 1}:${column + 1}`])) {
      return grid[`${row - 1}:${column + 1}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row}:${column - 1}`])) {
      return grid[`${row}:${column - 1}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row}:${column + 1}`])) {
      return grid[`${row}:${column + 1}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row + 1}:${column - 1}`])) {
      return grid[`${row + 1}:${column - 1}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row + 1}:${column}`])) {
      return grid[`${row + 1}:${column}`];
    }

    if (this.rockPaperScissors(current_color, grid[`${row + 1}:${column + 1}`])) {
      return grid[`${row + 1}:${column + 1}`];
    }

    return current_color;
  }

  getUpdate(algo) {
    let updated_grid = {};

    for (let i = 1; i <= algo.rows; i++) {
      for (let j = 1; j <= algo.columns; j++) {
        updated_grid[`${i}:${j}`] = this.checkNeighbors(i, j, algo.grid);
      }
    }
    algo.grid = updated_grid;
    return algo;
  }

}

class GameOfLife {
  getAlgo(rows, columns, initialConditions, runs) {
    let algo = {};
    algo["rows"] = rows;
    algo["columns"] = columns;
    algo["grid"] = {};
    algo["runs"] = runs;
    for (let index in initialConditions) {
      algo.grid[initialConditions[index]] = "black";
    }
    
    return algo;
  }

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

  getUpdate(algo) {
    let updated_grid = {};

    for (let i = 1; i <= algo.rows; i++) {
      for (let j = 1; j <= algo.columns; j++) {
        let neighborCount = this.countNeighbors(i, j, algo.grid);
        let isAlive = `${i}:${j}` in algo.grid;

        if ((isAlive && (neighborCount === 2 || neighborCount === 3)) || (!isAlive && neighborCount === 3)) {
          updated_grid[`${i}:${j}`] = "black";
        }
      }
    }
    algo.grid = updated_grid;
    return algo;
  }
}

let doGameOfLife = () => {
  let gameOfLife = new GameOfLife();
  let algo = gameOfLife.getAlgo(rows, columns, [`51:51`,`52:51`,`53:51`,`51:52`,`52:50`], 1500);
  drawGrid(algo);
  drawAutomota(algo.grid);
  let loopId = setInterval(() => {
    algo = gameOfLife.getUpdate(algo);
    clearCanvas();
    drawGrid(algo);
    drawAutomota(algo.grid);
    algo.runs = algo.runs - 1;
    if (algo.runs <= 0) {
      clearInterval(algo.loop);
    }
  }, 80);
  algo["loop"] = loopId;
}

let doRockPaperScissors = () => {
  let rockPaperScissors = new RockPaperScissors();
  let initialConditions = [];

  // For horizontal stripes, pretty boring
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= columns; j++) {
      let color = "";
      if ((i + j) % 3 === 0) {
        color = "green";
      } else if ((i + j) % 2 === 0) {
        color = "red";
      } else {
        color = "blue";
      }
      initialConditions.push({ coordinates: `${i}:${j}`, color });
    }
  }
  let algo = rockPaperScissors.getAlgo(rows, columns, initialConditions, 100);
  drawGrid(algo);
  drawAutomota(algo.grid);

  let loopId = setInterval(() => {
    algo = rockPaperScissors.getUpdate(algo);
    clearCanvas();
    drawGrid(algo);
    drawAutomota(algo.grid);
    algo.runs = algo.runs - 1;
    if (algo.runs <= 0) {
      clearInterval(algo.loop);
    }
  }, 80);
  algo["loop"] = loopId;
}

// doGameOfLife();
doRockPaperScissors();