class Game {
  constructor() {
    this.height = 5;
    this.width = 10;
    this.elements = {
      buttons: {
        // startButton
      },
      grids: {
        // playerGrid
        //computerGrid
      },
      // gameboard
      // shipContainer
    };
  }
  renderGame() {
    this.renderGameboard();
    this.renderShipContainer();
    this.renderButton("start", "gameboard");
    this.renderButton("rotate", "shipContainer");
  }
  renderGameboard() {
    this.elements.gameboard = document.createElement("div");
    this.elements.gameboard.classList.add("gameboard");
    document.body.append(this.elements.gameboard);
    this.renderGrid("player");
    this.renderGrid("computer");
  }
  renderButton(buttonName, location) {
    this.elements.buttons[`${buttonName}Button`] = document.createElement("button");
    this.elements.buttons[`${buttonName}Button`].classList.add("button");
    this.elements.buttons[`${buttonName}Button`].id = `${buttonName}Button`;
    this.elements.buttons[`${buttonName}Button`].innerHTML = buttonName.toUpperCase();
    this.elements[location].appendChild(this.elements.buttons[`${buttonName}Button`]);
  }
  renderGrid(user) {
    this.elements.grids[`${user}Grid`] = document.createElement("div");
    this.elements.grids[`${user}Grid`].classList.add("grid");
    this.elements.grids[`${user}Grid`].id = `${user}Grid`;
    this.elements.gameboard.appendChild(this.elements.grids[`${user}Grid`]);
    this.renderCells(user);
  }
  renderCells(user) {
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement("div");
      cell.classList.add(`${user}Cell`, "cell");
      cell.id = `${user}${i + 1}`;
      this.elements.grids[`${user}Grid`].appendChild(cell);
    }
  }
  renderShipContainer() {
    this.elements.shipContainer = document.createElement("div");
    this.elements.shipContainer.classList.add("shipContainer");
    this.elements.gameboard.appendChild(this.elements.shipContainer);
    this.renderShipPreview(sloop);
    this.renderShipPreview(sloop_2);
    this.renderShipPreview(brig);
    this.renderShipPreview(galleon);
    this.renderShipPreview(dreadnought);
  }
  renderShipPreview(ship) {
    ship.preview.classList.add("shipPreview");
    ship.preview.id = ship.type;
    ship.preview.draggable = true;
    ship.preview.style.width = `${ship.length * 35}px`;
    this.elements.shipContainer.appendChild(ship.preview);
  }
}

class Ship {
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.preview = document.createElement("div");
  }
}

const game = new Game();
const sloop = new Ship("sloop", 2);
const sloop_2 = new Ship("sloop_2", 2)
const brig = new Ship("brig", 3);
const galleon = new Ship("galleon", 4);
const dreadnought = new Ship("dreadnought", 5);

game.renderGame();
console.log(game.elements);
console.log(game.elements.buttons)
console.log(game.elements.grids)
