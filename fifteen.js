const grid = document.getElementById('puzzle-grid');
const shuffleButton = document.getElementById('shuffle-button');
const backgroundSelector = document.getElementById('background-selector');
const gameTimeDisplay = document.getElementById('game-time');
const moveCounterDisplay = document.getElementById('move-counter');

// Puzzle setup
let tiles = [];
let gameStarted = false;
let timer = null;
let elapsedTime = 0;
let moveCounter = 0;

// Backgrounds
const backgrounds = [
  'background1.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
];

// Set default background
let currentBackground = backgrounds[0];

// Initialize puzzle
function createPuzzle() {
  tiles = [];
  grid.innerHTML = ''; // Clear grid
  elapsedTime = 0;
  moveCounter = 0;
  updateUI();

  for (let i = 1; i <= 15; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.textContent = i;

    // Use the default background1.jpg on load
    tile.style.backgroundImage = `url('${currentBackground}')`;
    tile.style.backgroundPosition = `${-((i - 1) % 4) * 100}px ${-Math.floor((i - 1) / 4) * 100}px`;
    grid.appendChild(tile);
    tiles.push(tile);
  }

  // Add blank space
  const blankTile = document.createElement('div');
  blankTile.classList.add('tile', 'blank');
  grid.appendChild(blankTile);
  tiles.push(blankTile);
}

// Move tiles
function moveTile(clickedTile) {
  const blankTile = document.querySelector('.tile.blank');
  const clickedIndex = tiles.indexOf(clickedTile);
  const blankIndex = tiles.indexOf(blankTile);

  const isRowMove = Math.floor(clickedIndex / 4) === Math.floor(blankIndex / 4);
  const isColumnMove = clickedIndex % 4 === blankIndex % 4;

  if (isRowMove || isColumnMove) {
    gameStarted = true;
    if (timer === null) startTimer();
    moveCounter++;

    const tilesToMove = [];
    if (isRowMove) {
      const [start, end] = clickedIndex < blankIndex ? [clickedIndex, blankIndex] : [blankIndex, clickedIndex];
      for (let i = start; i <= end; i++) tilesToMove.push(tiles[i]);
    } else if (isColumnMove) {
      const [start, end] = clickedIndex < blankIndex ? [clickedIndex, blankIndex] : [blankIndex, clickedIndex];
      for (let i = start; i <= end; i += 4) tilesToMove.push(tiles[i]);
    }

    tilesToMove.forEach((tile, index) => {
      setTimeout(() => {
        swapTiles(tile, blankTile);
        if (index === tilesToMove.length - 1) checkWin();
      }, index * 100);
    });
  }
}

// Swap tiles
function swapTiles(tile1, tile2) {
  const index1 = tiles.indexOf(tile1);
  const index2 = tiles.indexOf(tile2);
  tiles[index1] = tile2;
  tiles[index2] = tile1;

  // Update DOM
  grid.innerHTML = '';
  tiles.forEach((tile) => grid.appendChild(tile));
}

// Shuffle tiles
function shufflePuzzle() {
  for (let i = 0; i < 1000; i++) {
    const movableTiles = tiles.filter((tile) =>
      tile !== document.querySelector('.tile.blank') &&
      isAdjacent(tile, document.querySelector('.tile.blank'))
    );
    const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
    swapTiles(randomTile, document.querySelector('.tile.blank'));
  }
  gameStarted = false;
  clearInterval(timer);
  elapsedTime = 0;
  moveCounter = 0;
  updateUI();
}

// Check adjacency
function isAdjacent(tile1, tile2) {
  const index1 = tiles.indexOf(tile1);
  const index2 = tiles.indexOf(tile2);
  return (
    index1 === index2 - 1 ||
    index1 === index2 + 1 ||
    index1 === index2 - 4 ||
    index1 === index2 + 4
  );
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    elapsedTime++;
    updateUI();
  }, 1000);
}

function updateUI() {
  gameTimeDisplay.textContent = `Time: ${elapsedTime} seconds`;
  moveCounterDisplay.textContent = `Moves: ${moveCounter}`;
}

// Check win
function checkWin() {
  const isSolved = tiles.every((tile, index) => {
    return tile.classList.contains('blank') || tile.textContent == index + 1;
  });

  if (isSolved) {
    clearInterval(timer);
    const winMessage = document.createElement('div');
    winMessage.classList.add('win-message');
    winMessage.textContent = `Congratulations! Solved in ${elapsedTime} seconds and ${moveCounter} moves!`;
    document.body.appendChild(winMessage);
  }
}

// Event listeners
grid.addEventListener('click', (e) => {
  if (e.target.classList.contains('tile') && !e.target.classList.contains('blank')) {
    moveTile(e.target);
  }
});

shuffleButton.addEventListener('click', shufflePuzzle);

// Background selection
backgroundSelector.addEventListener('change', (e) => {
  currentBackground = e.target.value;
  tiles.forEach((tile) => {
    if (!tile.classList.contains('blank')) {
      tile.style.backgroundImage = `url('${currentBackground}')`;
    }
  });
});

// Initialize puzzle
createPuzzle();
