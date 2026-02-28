function createDom(player1, player2) {
  const playerOne = player1;
  const playerTwo = player2;

  let currentRotation = "0";
  let selectedShip = null;
  createShipList(playerOne);
  renderGameboards();
  populateBoards();
  addRotationControls();

  function renderGameboards() {
    renderGameboard(playerOne, "player-one-board");
    renderGameboard(playerTwo, "player-two-board");
  }

  function renderGameboard(player, playerContainerId) {
    const container = document.getElementById(playerContainerId);
    container.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = j;
        cell.dataset.y = i;
        container.appendChild(cell);
      }
    }
  }

  function createShipList(player) {
    const container = document.getElementById("ship-list-container");
    const shipList =
      document.getElementById("ship-list") || document.createElement("div");
    shipList.innerHTML = "";
    shipList.id = "ship-list";

    player.playersShips.forEach((shipObj, index) => {
      const shipItemContainer = document.createElement("div");
      shipItemContainer.classList.add("ship-item-container");
      const shipLabel = document.createElement("span");
      shipLabel.textContent =
        shipObj.ship.length === 1
          ? "Submarine"
          : `Length: ${shipObj.ship.length}`;
      shipItemContainer.appendChild(shipLabel);

      if (!shipObj.placed) {
        const shipItem = document.createElement("div");
        shipItem.classList.add("ship-item");
        shipItem.textContent = "----".repeat(shipObj.ship.length);
        shipItem.draggable = true;

        shipItem.addEventListener("dragstart", (e) => {
          selectedShip = index;
          e.dataTransfer.setData("text/plain", index);
        });

        shipItem.addEventListener("dragend", () => {
          selectedShip = null;
          clearHoverEffects();
        });
        shipItemContainer.appendChild(shipItem);
      }

      shipList.appendChild(shipItemContainer);
    });

    container.appendChild(shipList);
  }

  function populateBoards() {
    populateBoard(playerOne, "player-one-board");
    addShipDragAndDropListeners(playerOne, "player-one-board");
    populateBoard(playerTwo, "player-two-board");
  }
  function populateBoard(player, playerContainerId) {
    const container = document.getElementById(playerContainerId);
    const cells = container.getElementsByClassName("cell");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cellIndex = i * 10 + j;
        const cellCur = cells[cellIndex];

        if (
          player.playersGameboard.board[i][j] === 1 ||
          (typeof player.playersGameboard.board[i][j] === "object" &&
            player.playersGameboard.board[i][j] !== null)
        ) {
          if (playerContainerId === "player-one-board") {
            cellCur.classList.add("ship");
          }
        } else if (player.playersGameboard.board[i][j] === "x") {
          cellCur.classList.add("hit");
          cellCur.textContent = "x";
        } else if (player.playersGameboard.board[i][j] === "o") {
          cellCur.classList.add("miss");
          cellCur.textContent = "o";
        }
      }
    }
  }

  function populateComputersBoardOnWin() {
    const container = document.getElementById("player-two-board");
    const cells = container.getElementsByClassName("cell");

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cellIndex = i * 10 + j;
        const cellCur = cells[cellIndex];

        if (
          playerTwo.playersGameboard.board[i][j] === 1 ||
          (typeof playerTwo.playersGameboard.board[i][j] === "object" &&
            playerTwo.playersGameboard.board[i][j] !== null)
        ) {
          cellCur.classList.add("ship");
        } else if (playerTwo.playersGameboard.board[i][j] === "x") {
          cellCur.classList.add("hit");
          cellCur.textContent = "x";
        } else if (playerTwo.playersGameboard.board[i][j] === "o") {
          cellCur.classList.add("miss");
          cellCur.textContent = "o";
        }
      }
    }
  }

  function addRotationControls() {
    const container = document.getElementById("ship-list-container");

    if (document.getElementById("rotate-btn")) return;

    const rotateBtn = document.createElement("button");
    rotateBtn.id = "rotate-btn";
    rotateBtn.textContent = "Toggle Rotation (or press R)";

    rotateBtn.addEventListener("click", () => {
      currentRotation = currentRotation === "0" ? "1" : "0";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "r" || e.key === "R") {
        currentRotation = currentRotation === "0" ? "1" : "0";
      }
    });

    container.prepend(rotateBtn);
  }

  function clearHoverEffects() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("hover-valid");
      cell.classList.remove("hover-invalid");
    });
  }

  function addShipDragAndDropListeners(player, playerContainerId) {
    const container = document.getElementById(playerContainerId);
    const cells = container.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      cell.addEventListener("dragover", (e) => {
        e.preventDefault();
        clearHoverEffects();

        if (selectedShip === null) return;

        const shipObj = player.playersShips[selectedShip];
        const shipLength = shipObj.ship.length;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        let isValid = player.playersGameboard.checkIfEligible(
          shipLength,
          x,
          y,
          currentRotation,
        );
        const affectedCells = [];

        if (currentRotation === "0") {
          if (x + shipLength <= 10) {
            for (let j = 0; j < shipLength; j++) {
              affectedCells.push(cells[i + j]);
            }
          } else {
            isValid = false;
          }
        } else {
          if (y + shipLength <= 10) {
            for (let j = 0; j < shipLength; j++) {
              affectedCells.push(cells[i + j * 10]);
            }
          } else {
            isValid = false;
          }
        }

        affectedCells.forEach((targetCell) => {
          if (targetCell) {
            targetCell.classList.add(isValid ? "hover-valid" : "hover-invalid");
          }
        });
      });

      cell.addEventListener("dragleave", (e) => {
        if (e.relatedTarget && !container.contains(e.relatedTarget)) {
          clearHoverEffects();
        }
      });

      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        clearHoverEffects();

        if (selectedShip === null) return;

        const shipIndex = e.dataTransfer.getData("text/plain");
        const shipObj = player.playersShips[shipIndex];

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (shipObj && !shipObj.placed) {
          const result = player.playersGameboard.placeShip(
            shipObj.ship,
            x,
            y,
            currentRotation,
          );

          if (typeof result === "string" && result.includes("successfully")) {
            if (typeof shipObj.ship.setPosition === "function") {
              shipObj.ship.setPosition(x, y, currentRotation);
            }
            shipObj.placed = true;

            renderGameboards();
            populateBoards();
            createShipList(player);
          }
        }
        selectedShip = null;
      });
    }
  }

  return {
    populateBoards,
    populateComputersBoardOnWin,
  };
}

export { createDom };
