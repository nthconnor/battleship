class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.cellSize = height / 10;
    this.gameboard = document.createElement("div");
    this.shipContainer = document.createElement("div");
    this.ships = ["sloop", "sloop", "brig", "brig", "galleon", "flagship"];
    this.grids = {};
    this.gameRunning = false;
  }
  // render the main gameboard to build in
  renderGame() {
    this.gameboard.classList.add("gameboard");
    this.gameboard.style.height = `${this.height}px`;
    this.gameboard.style.width = `${this.width}px`;
    document.body.appendChild(this.gameboard);
    this.renderGrid("player", this.height, this.width / 2);
    this.renderGrid("computer", this.height, this.width / 2);
    this.renderShipContainer();
    console.log("game rendered");
  }
  // render grids for player and computer,
  renderGrid(user, height, width) {
    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.id = `${user}Grid`;
    grid.style.height = `${height}px`;
    grid.style.width = `${width}px`;
    this.grids[`${user}Grid`] = grid;
    this.gameboard.appendChild(grid);
    this.renderCells(grid, user);
    console.log("grids rendered");
  }
  // render cells for each user grid
  renderCells(grid, user) {
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement("div");
      cell.classList.add(`${user}cell`);
      cell.id = `${user}${i + 1}`;
      cell.style.height = `${this.cellSize}px`;
      cell.style.width = `${this.cellSize}px`;
      grid.appendChild(cell);
    }
  }
  // render container for ship previews
  renderShipContainer() {
    this.shipContainer.classList.add("shipContainer");
    this.shipContainer.style.height = `${this.height / 1.5}px`;
    this.shipContainer.style.width = `${this.width}px`;
    this.gameboard.appendChild(this.shipContainer);
    this.renderShipPreviews();
  }
  // render draggable ship previews
  renderShipPreviews() {
    sloop.renderShipPreview();
    sloop2.renderShipPreview();
    brig.renderShipPreview();
    galleon.renderShipPreview();
    flagship.renderShipPreview();
  }
}

class Ship {
    constructor(type, length) {
        this.type = type;
        this.length = length;
        this.ship = document.createElement("div");
        this.preview = document.createElement("div");
    }
    renderShipPreview() {
        this.preview.classList.add(`${this.type}Preview`)
        this.preview.draggable = true;
        game.shipContainer.appendChild(this.preview);
    }
}

const game = new Game(400, 800);
const sloop = new Ship("sloop", 2);
const sloop2 = new Ship("sloop", 2);
const brig = new Ship("brig", 3);
const galleon = new Ship("galleon", 4);
const flagship = new Ship("flagship", 5);
game.renderGame();
