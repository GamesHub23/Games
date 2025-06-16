const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 8;
const COLS = 8;
const BLOCK_SIZE = canvas.width / COLS;
const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

let grid = [];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function initGrid() {
  grid = [];
  for(let r=0; r<ROWS; r++) {
    let row = [];
    for(let c=0; c<COLS; c++) {
      row.push(randomColor());
    }
    grid.push(row);
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let r=0; r<ROWS; r++) {
    for(let c=0; c<COLS; c++) {
      ctx.fillStyle = grid[r][c];
      ctx.fillRect(c*BLOCK_SIZE, r*BLOCK_SIZE, BLOCK_SIZE-2, BLOCK_SIZE-2);
    }
  }
}

function floodFill(r, c, color) {
  if(r < 0 || r >= ROWS || c < 0 || c >= COLS) return [];
  if(grid[r][c] !== color) return [];
  let stack = [[r, c]];
  let matched = [];
  while(stack.length) {
    const [x,y] = stack.pop();
    if(x < 0 || x >= ROWS || y < 0 || y >= COLS) continue;
    if(grid[x][y] !== color) continue;
    if(matched.find(e => e[0] === x && e[1] === y)) continue;
    matched.push([x,y]);
    stack.push([x+1,y]);
    stack.push([x-1,y]);
    stack.push([x,y+1]);
    stack.push([x,y-1]);
  }
  return matched;
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / BLOCK_SIZE);
  const y = Math.floor((e.clientY - rect.top) / BLOCK_SIZE);
  const color = grid[y][x];
  const matched = floodFill(y, x, color);
  if(matched.length < 2) return; // minim 2 blocuri pentru eliminare

  for(const [r, c] of matched) {
    grid[r][c] = null;
  }

  // Cădem blocurile și completăm spațiile goale
  for(let c=0; c<COLS; c++) {
    let colBlocks = [];
    for(let r=ROWS-1; r>=0; r--) {
      if(grid[r][c]) colBlocks.push(grid[r][c]);
    }
    for(let r=ROWS-1; r>=0; r--) {
      grid[r][c] = colBlocks.shift() || randomColor();
    }
  }

  drawGrid();
});

document.getElementById('fullscreen-btn').onclick = () => {
  if(canvas.requestFullscreen) {
    canvas.requestFullscreen();
  }
};

initGrid();
drawGrid();
