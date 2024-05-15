class Game {
  constructor() {
    this.isRunning;
    this.turn;
    this.height = 10;
    this.width = 10;
    this.elements = {
      body: document.querySelector("body"),
      title: document.createElement("h1"),
      combatLog: document.createElement("div"),
      buttons: {},
      grids: {},
      ships: [],
      audio: {
        soundtrack: document.createElement("audio"),
        startButton: document.createElement("audio"),
      },
    };
  }
  onStart() {
    this.renderGame();
    this.elements.buttons.startButton.style.display = "none";
    this.elements.audio.soundtrack.play();
    this.elements.audio.startButton.play();
  }
  renderTitle() {
    this.elements.title.innerText = "PIRATESHIP";
    this.elements.title.classList.add("title");
    document.body.append(this.elements.title);
    this.renderButton("start", "body", this.onStart.bind(this));
  }
  renderGame() {
    this.renderGameboard();
    this.renderLog();
    this.addShip("computer", sloop);
    this.addShip("computer", sloop_2);
    this.addShip("computer", brig);
    this.addShip("computer", galleon);
    this.addShip("computer", dreadnought);
    this.addShip("player", sloop);
    this.addShip("player", sloop_2);
    this.addShip("player", brig);
    this.addShip("player", galleon);
    this.addShip("player", dreadnought);
    setTimeout(() => {
      this.updateLog("enemy ships ahead, fire when ready!")
    }, 500);
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
  renderLog() {
    this.elements.combatLog.classList.add("combatLog");
    this.elements.combatLog.innerHTML = "";
    this.elements.gameboard.appendChild(this.elements.combatLog);
  }
  updateLog(string) {
    this.elements.combatLog.style.visibility = "visible";
    let characterPosition = 0;
    function addLetter() {
      if (characterPosition < string.length) {
        game.elements.combatLog.innerHTML += string.charAt(characterPosition);
        characterPosition++;
        setTimeout(addLetter, 80);
      }
    }
    addLetter();
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
  renderButton(buttonName, location, buttonEvent) {
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
      buttonEvent
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
  handleTurns() {

  }
  handleAudio() {
    const main_theme = this.elements.audio.soundtrack;
    main_theme.src = "/assets/audio/main_theme.mp3";
    main_theme.volume = 0.07;
    const startButtonSound = this.elements.audio.startButton;
    startButtonSound.src = "/assets/audio/start_button.mp3";
    startButtonSound.volume = 0.5;
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

game.renderTitle();
game.handleAudio();


// computer turn {
//   let suggestedHits = []
//   let randomIndex = Math.random() * suggesthits.length ?
//   if (!playerturn) {
//     randomcell()
//     if (randomcell.classlist.contains("taken") {
//       randomcell.classlist.remove("taken")
//       randomcell.classlist.add("hit")
//       suggestedHits.push((randomcell + 1), (randomcell - 1), (randomcell + 10), randomcell - 10)
//     })
//   }
// }
