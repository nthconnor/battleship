class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.gameboard = document.createElement("div");
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
    for (let i = 0; i < (this.width / 80) * (this.width / 80); i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${user}${i + 1}`;
      grid.appendChild(cell);
    }
  }
}
const game = new Game(400, 800);
game.renderGame();
