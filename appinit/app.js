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
  context.lineWidth = 2;
  context.strokeRect(x, y, width, height);
}

let drawRectFill = (x, y, color, width, height) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

let getTopRight = (row, column) => {
  // make this function take cell dims as input
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

let drawCellAndWall = (row, column, color) => {
  let { x, y } = getTopRight(row, column);
  drawRect(y, x, "black", cell_dims, cell_dims); 
  drawRectFill(y, x, color, cell_dims, cell_dims); 
}

let drawGrid = (rows, columns) => {
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= columns; j++) {
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

let getCellFromCoordinates = (x, y, cell_dims) => {
  let row = Math.floor(y / cell_dims);
  let column = Math.floor(x / cell_dims);
  return { row, column };
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
  drawGrid(algo.rows, algo.columns);
  drawAutomota(algo.grid);
  let loopId = setInterval(() => {
    algo = gameOfLife.getUpdate(algo);
    clearCanvas();
    drawGrid(algo.rows, algo.columns);
    drawAutomota(algo.grid);
    algo.runs = algo.runs - 1;
    if (algo.runs <= 0) {
      clearInterval(algo.loop);
    }
  }, 80);
  algo["loop"] = loopId;
}

let doRockPaperScissors = (initialConditions, runs) => {
  let rockPaperScissors = new RockPaperScissors();
  let algo = rockPaperScissors.getAlgo(rows, columns, initialConditions, runs);
  clearCanvas();
  drawAutomota(algo.grid);
  drawGrid(algo.rows, algo.columns);

  let loopId = setInterval(() => {
    algo = rockPaperScissors.getUpdate(algo);
    clearCanvas();
    drawAutomota(algo.grid);
    drawGrid(algo.rows, algo.columns);
    algo.runs = algo.runs - 1;
    if (algo.runs <= 0) {
      clearInterval(algo.loop);
    }
  }, 80);
  algo["loop"] = loopId;
}

class RockPaperScissorsApp {
  constructor(rows, columns) {
    this.record = {};
    this.rows = rows;
    this.columns = columns;
    this.brush = "white";
    this.mousedown = false;
    for (let i = 1; i <= this.rows; i++) {
      for (let j = 1; j <= this.columns; j++) {
        this.record[`${i}:${j}`] = "white"; 
      }
    }
    drawAutomota(this.record);
    drawGrid(this.rows, this.columns);
    let div = document.getElementById("div");
    let redButtonString = `<button id="red_button">Red</button>`;
    let blueButtonString = `<button id="blue_button">Blue</button>`;
    let greenButtonString = `<button id="green_button">Green</button>`;
    let eraseButtonString = `<button id="erase_button">Erase</button>`;
    let clearButtonString = `<button id="clear_button">Clear</button>`;
    let startButtonString = `<button id="start_button">Start</button>`;
    let runsInputString = `<label>Runs:<input id='runs_input' type="number"></label>`;
    div.innerHTML = `${redButtonString}${blueButtonString}${greenButtonString}${eraseButtonString}${clearButtonString}${startButtonString}${runsInputString}`
    let redButton = document.getElementById("red_button");
    let blueButton = document.getElementById("blue_button");
    let greenButton = document.getElementById("green_button");
    let eraseButton = document.getElementById("erase_button");
    let clearButton = document.getElementById("clear_button");
    let startButton = document.getElementById("start_button");

    this.setRedBrush = this.setRedBrush.bind(this);
    this.setGreenBrush = this.setGreenBrush.bind(this);
    this.setBlueBrush = this.setBlueBrush.bind(this);
    this.setWhiteBrush = this.setWhiteBrush.bind(this);
    this.clear = this.clear.bind(this);
    this.start = this.start.bind(this);
    this.clickCanvas = this.clickCanvas.bind(this);
    this.paintCanvas = this.paintCanvas.bind(this);

    clearButton.addEventListener("click", this.clear);
    redButton.addEventListener("click", this.setRedBrush);
    blueButton.addEventListener("click", this.setBlueBrush);
    greenButton.addEventListener("click", this.setGreenBrush);
    eraseButton.addEventListener("click", this.setWhiteBrush);
    canvas.addEventListener("click", this.clickCanvas);
    canvas.addEventListener("mousemove", this.paintCanvas);
    startButton.addEventListener("click", this.start);
  }

  clickCanvas(event) {
    if(!this.mousedown) {
      this.mousedown = true;
      this.draw(event);
    } else {
      this.mousedown = false;
    }
  }

  paintCanvas(event) {
    if (this.mousedown) {
      this.draw(event);
    }
  }

  setRedBrush() {
    this.brush = "red";
  }

  setGreenBrush() {
    this.brush = "green";
  }

  setBlueBrush() {
    this.brush = "blue";
  }

  setWhiteBrush() {
    this.brush = "white";
  }

  draw(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let { row, column } = getCellFromCoordinates(x, y, cell_dims);
    this.record[`${row}:${column}`] = this.brush;
    drawCell(row, column, this.brush);
    drawGrid(this.rows, this.columns);
  }

  clear() {
    for (let i = 1; i <= this.rows; i++) {
      for (let j = 1; j <= this.columns; j++) {
        this.record[`${i}:${j}`] = "white"; 
      }
    }
    drawAutomota(this.record);
    drawGrid(this.rows, this.columns);
  }

  start() {
    let div = document.getElementById("div");
    let runsInput = document.getElementById("runs_input");
    let runs = parseInt(runsInput.value);
    if (Number.isNaN(runs) || !Number.isInteger(runs) || runs <= 0) {
      let errorMessageString = "<p id='runs_error'>Enter a valid positive integer for runs.</p>";
      div.innerHTML += errorMessageString;
      return;
    }
    document.getElementById("red_button").removeEventListener('click', this.setRedBrush);
    document.getElementById("blue_button").removeEventListener('click', this.setBlueBrush);
    document.getElementById("green_button").removeEventListener('click', this.setGreenBrush);
    document.getElementById("erase_button").removeEventListener('click', this.setWhiteBrush);
    document.getElementById("clear_button").removeEventListener('click', this.clear);
    document.getElementById("start_button").removeEventListener('click', this.start);
    canvas.removeEventListener("click", this.clickCanvas);
    canvas.removeEventListener("mousemove", this.paintCanvas);
    div.innerHTML = "";
    clearCanvas();
    let initialConditions = [];
    for (let cell in this.record) {
      initialConditions.push({ coordinates: cell, color: this.record[cell] });
    }
    doRockPaperScissors(initialConditions, runs);
  }
}

let rockPaperScissorsApp = new RockPaperScissorsApp(rows, columns);