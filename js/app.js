class Game {
  constructor() {
    this.height = 5;
    this.width = 10;
    this.elements = {
      buttons: {
        // startButton -> renderGame
        // rotateButton -> renderShipContainer
      },
      grids: {
        // playerGrid
        //computerGrid
      },
      ships: [
        // pushing ship types from Ship class render method
      ],
      // gameboard
      // shipContainer
    };
  }
  renderGame() {
    this.renderGameboard();
    this.renderShipContainer();
    this.renderButton("start", "gameboard");
    this.elements.ships.forEach((ship) => this.placeShip("computer", ship));
  }
  renderGameboard() {
    this.elements.gameboard = document.createElement("div");
    this.elements.gameboard.classList.add("gameboard");
    document.body.append(this.elements.gameboard);
    this.renderGrid("player");
    this.renderGrid("computer");
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
    this.renderButton("rotate", "shipContainer", () => {
      this.elements.ships.forEach((ship) => this.shipRotate(ship));
    });
    sloop.renderShipPreview(this.elements.shipContainer);
    sloop_2.renderShipPreview(this.elements.shipContainer);
    brig.renderShipPreview(this.elements.shipContainer);
    galleon.renderShipPreview(this.elements.shipContainer);
    dreadnought.renderShipPreview(this.elements.shipContainer);
  }
  shipRotate(ship) {
    if (ship.angle === 0) {
      ship.angle += 90;
    } else {
      ship.angle = 0;
    }
    ship.preview.style.transform = `rotate(${ship.angle}deg)`;
  }
  renderButton(buttonName, location, event) {
    this.elements.buttons[`${buttonName}Button`] =
      document.createElement("button");
    this.elements.buttons[`${buttonName}Button`].classList.add("button");
    this.elements.buttons[`${buttonName}Button`].id = `${buttonName}Button`;
    this.elements.buttons[`${buttonName}Button`].innerHTML =
      buttonName.toUpperCase();
    this.elements[location].appendChild(
      this.elements.buttons[`${buttonName}Button`]
    );
    this.elements.buttons[`${buttonName}Button`].addEventListener(
      "click",
      event
    );
  }
  placeShip(user, ship) {
    const cells = document.querySelectorAll(`#${user}Grid div`);
    let randomCell = Math.floor(Math.random() * 100);
    let rotated = Math.random() < 0.5;
    let shipCells = [];
    populateCells();

    function populateCells() {
        for (let i = 0; i < ship.length; i++) {
            if (rotated) {
                shipCells.push(cells[Number(validCell()) + i])
            } else {
                shipCells.push(cells[Number(validCell()) + i * game.width])
            }
        }
        shipCells.forEach(cell => {
            cell.classList.add(ship.type)
            cell.classList.add("taken")
        })
    }
    function validCell() {
        if (rotated) {
            if (randomCell <= 100 - ship.length) {
                return randomCell
            } else {
                return 100 - ship.length
            }
        } else {
            if (randomCell <= 100 - 10 * ship.length) {
                return randomCell
            } else {
                return randomCell - ship.length * 10 + 10
            }
        }
    }
  }
}

class Ship {
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.preview = document.createElement("div");
    this.angle = 0;
  }
  renderShipPreview(container) {
    game.elements.ships.push(this);
    this.preview.classList.add("shipPreview");
    this.preview.id = this.type;
    this.preview.draggable = true;
    this.preview.dataset.shipType = this.type;
    this.preview.style.width = `${this.length * 35}px`;
    container.appendChild(this.preview);
  }
  // rotate() {
  //   if (this.angle === 0) {
  //     this.angle += 90;
  //     this.preview.style.transform = `rotate(${this.angle}deg)`;
  //   } else {return}
  // }
}

const game = new Game();
const sloop = new Ship("sloop", 2);
const sloop_2 = new Ship("sloop_2", 2);
const brig = new Ship("brig", 3);
const galleon = new Ship("galleon", 4);
const dreadnought = new Ship("dreadnought", 5);

game.renderGame();
console.log(game.elements.shipContainer.children)
