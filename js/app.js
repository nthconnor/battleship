class Game {
  constructor() {
    this.height = 10;
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
    this.renderButton("start", "gameboard");
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
  getRandomCellBlock() {
    const randomCellIndex = Math.floor(Math.random() * 100);
    const randomRow = Math.floor(randomCellIndex / this.width);
    const randomCol = randomCellIndex % this.width;
    return { row: randomRow, col: randomCol };
  }
  addShip(user, ship) {
    const cells = document.querySelectorAll(`#${user}Grid div`);
    let shipCells = [];
    let rotated = Math.random() < 0.5;
    let randomCellBlock;
    let startCell;

    do {
      randomCellBlock = this.getRandomCellBlock();
      startCell = parseInt(`${randomCellBlock.row}${randomCellBlock.col}`);
    } while (!validCell(startCell));

    for (let i = 0; i < ship.length; i++) {
      if (rotated) {
        shipCells.push(cells[startCell + i]);
      } else {
        shipCells.push(cells[startCell + i * 10]);
      }
    }
    shipCells.forEach((cell) => {
      cell.classList.add(`${user}_${ship.type}`);
      cell.classList.add("taken");
    });

    function validCell(startCell) {
      const startRow = randomCellBlock.row;
      const startCol = randomCellBlock.col;
      if (rotated) {
        if (startCol + ship.length <= 10) {
          for (let i = startCol; i < startCol + ship.length; i++) {
            const index = startRow * 10 + i;
            if (cells[index].classList.contains("taken")) {
              return false;
            }
          }
          return startCell;
        }
      } else {
        if (startRow + ship.length <= 10) {
          for (let i = startRow; i < startRow + ship.length; i++) {
            const index = i * 10 + startCol;
            if (cells[index].classList.contains("taken")) {
              return false;
            }
          }
          return startCell;
        }
      }
      return false;
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
game.addShip("computer", sloop);
game.addShip("computer", sloop_2);
game.addShip("computer", brig);
game.addShip("computer", galleon);
game.addShip("computer", dreadnought);
game.addShip("player", sloop);
game.addShip("player", sloop_2);
game.addShip("player", brig);
game.addShip("player", galleon);
game.addShip("player", dreadnought);

// handle turn logic
// player should click a cell, display feedback on wether it was a hit or miss
// computer selects a cell at random - display feedback
// *** if computer hits, target cells in that area
// handle win/loss
//  if all ships on either side sink
// end game


/* 
computer turn {
  let suggestedHits = []
  let randomIndex = Math.random() * suggesthits.length ?
  if (!playerturn) {
    randomcell()
    if (randomcell.classlist.contains("taken") {
      randomcell.classlist.remove("taken")
      randomcell.classlist.add("hit")
      suggestedHits.push((randomcell + 1), (randomcell - 1), (randomcell + 10), randomcell - 10)
    })
  }
}
*/
