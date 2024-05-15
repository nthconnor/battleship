class Game {
  constructor() {
    this.isRunning;
    this.turn;
    this.height = 10;
    this.width = 10;
    this.elements = {
      body: document.querySelector("body"),
      title: document.createElement("h1"),
      rules: document.createElement("div"),
      combatLog: {
        window: document.createElement("div"),
        hitText: [],
        missText: [],
        sinkText: [],
      },
      buttons: {},
      grids: {},
      ships: [],
      audio: {
        soundtrack: document.createElement("audio"),
        ambience: document.createElement("audio"),
        startButton: document.createElement("audio"),
        cannon_1: document.createElement("audio"),
        cannon_2: document.createElement("audio"),
        cannonAmbient: document.createElement("audio"),
        shipHit: document.createElement("audio"),
      },
    };
    this.log;
  }
  onStart() {
    this.renderGame();
    this.handlePlayerTurn();
    this.elements.buttons.startButton.style.display = "none";
    this.elements.buttons.rulesButton.style.display = "none";
    this.elements.title.style.visibility = "hidden";
    this.elements.body.style.backgroundImage =
      "url(/assets/backgrounds/storm_gif2.gif)";
    this.elements.audio.soundtrack.play();
    this.elements.audio.ambience.play();
    this.elements.audio.startButton.play();
    setTimeout(() => {
      this.isRunning = true;
    }, 4000);
  }
  renderTitle() {
    this.elements.title.innerText = "PIRATESHIP";
    this.elements.title.classList.add("title");
    document.body.append(this.elements.title);
    this.renderButton("start", "body", this.onStart.bind(this));
    this.renderButton("rules", "body", this.displayRules.bind(this));
  }
  displayRules() {
    this.elements.title.style.visibility = "hidden";
    this.elements.rules.style.visibility = "visible";
    this.elements.rules.classList.add("rules");
    document.body.appendChild(this.elements.rules);
    const header = document.createElement("h1");
    this.elements.rules.appendChild(header);
    header.classList.add("rulesHeader");
    header.innerText = "The Pirate Code";
    const rulesText = document.createElement("p");
    rulesText.classList.add("rulesText");
    rulesText.innerText =
      'The battle begins once the first shot is fired. \nBoth sides engage in a "fire at will" style fight. \nSunk ships are marked with a Ώ';
    this.elements.rules.appendChild(rulesText);
    const closeButton = document.createElement("a");
    closeButton.innerText = "Close";
    closeButton.href = "#";
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", () => {
      this.elements.rules.style.visibility = "hidden";
      this.elements.title.style.visibility = "visible";
      rulesText.innerText = "";
    });
    this.elements.rules.appendChild(closeButton);
  }
  initGame() {
    this.isRunning = false;
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
      this.updateLog(
        "Captain placeholder, the enemy fleet is upon us. Cannons are at the ready, on your signal!"
      );
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
    this.elements.combatLog.window.classList.add("combatLog");
    this.elements.gameboard.appendChild(this.elements.combatLog.window);
  }
  updateLog(string) {
    this.elements.combatLog.window.style.visibility = "visible";
    let characterPosition = 0;
    function addLetter() {
      if (characterPosition < string.length) {
        game.elements.combatLog.window.innerHTML +=
          string.charAt(characterPosition);
        characterPosition++;
        setTimeout(addLetter, 80);
      }
    }
    this.elements.combatLog.window.innerHTML = "";
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
      cell.id = ship.type;
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
  handlePlayerTurn() {
    const computerCells = document.querySelectorAll("#computerGrid div");
    const computerShipHealth = {
      sloop: 2,
      sloop_2: 2,
      brig: 3,
      galleon: 4,
      dreadnought: 5,
    };
    for (let i = 0; i < computerCells.length; i++) {
      computerCells[i].addEventListener("click", handleClick);
    }
    function handleClick(e) {
      if (game.isRunning) {
        game.elements.audio.cannon_1.currentTime = 0;
        game.elements.audio.cannon_1.play();
        setTimeout(() => {
          game.elements.audio.cannonAmbient.play();
        }, 1000);
        if (e.target.classList.contains("taken")) {
          computerShipHealth[e.target.id] -= 1;
          e.target.classList.add("hit");
          checkBoard(e.target.id);
          game.elements.audio.shipHit.currentTime = 0;
          game.elements.audio.shipHit.play();
        } else {
          e.target.classList.add("miss");
        }
        function checkBoard(shipID) {
          if (computerShipHealth[shipID] === 0) {
            const sunkShipCells = document.querySelectorAll(
              `#computerGrid #${shipID}`
            );
            sunkShipCells.forEach((cell) => {
              cell.classList.remove("taken");
              cell.classList.add("sunk");
              cell.innerHTML = "Ώ";
            });
          }
        }
      }
    }
  }
  handleAudio() {
    const main_theme = this.elements.audio.soundtrack;
    main_theme.src = "/assets/audio/main_theme.mp3";
    main_theme.volume = 0.05;
    const ambience = this.elements.audio.ambience;
    ambience.src = "/assets/audio/thunderstorm.mp3";
    ambience.volume = 0.05;
    const startButtonSound = this.elements.audio.startButton;
    startButtonSound.src = "/assets/audio/start_button.mp3";
    startButtonSound.volume = 0.3;
    const cannon_1 = this.elements.audio.cannon_1;
    cannon_1.src = "/assets/audio/cannon1.mp3";
    cannon_1.volume = 0.3;
    const cannon_2 = this.elements.audio.cannon_2;
    cannon_2.src = "/assets/audio/cannon2.mp3";
    cannon_2.volume = 0.3;
    const cannonAmbient = this.elements.audio.cannonAmbient;
    cannonAmbient.src = "/assets/audio/distant_cannons.mp3";
    cannonAmbient.volume = 0.45;
    cannonAmbient.loop = true;
    const shipHit = this.elements.audio.shipHit;
    shipHit.src = "/assets/audio/ship_hit.mp3";
    shipHit.volume = 0.08;
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
