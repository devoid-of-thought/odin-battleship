function startGame(playerOne, playerTwo, domController) {
  let isPlayerTurn = true;
  let achievedHit = false;
  let cordsThatWereHit = [];
  let possibleAttacks = [];
  const computerBoard = document.getElementById("player-two-board");
  const playerBoard = document.getElementById("player-one-board");

  function populateCellsForSunkShip(ship, boardElement, defendingPlayer) {
    for (const coord of ship.coordinates) {
      const aroundCells = [
        [coord[0] - 1, coord[1]],
        [coord[0] + 1, coord[1]],
        [coord[0], coord[1] - 1],
        [coord[0], coord[1] + 1],
        [coord[0] - 1, coord[1] - 1],
        [coord[0] + 1, coord[1] - 1],
        [coord[0] - 1, coord[1] + 1],
        [coord[0] + 1, coord[1] + 1],
      ];
      aroundCells.forEach(([x, y]) => {
        if (x >= 0 && x < 10 && y >= 0 && y < 10) {
          const aroundCell = boardElement.querySelector(
            `.cell[data-x="${x}"][data-y="${y}"]`,
          );
          if (
            aroundCell &&
            !aroundCell.classList.contains("hit") &&
            !aroundCell.classList.contains("miss")
          ) {
            defendingPlayer.playersGameboard.receiveAttack(x, y);
            if (aroundCell.classList.contains("cell")) {
              aroundCell.classList.add("miss");
            }
          }
        }
      });
    }
  }

  computerBoard.addEventListener("click", function handler(event) {
    if (!isPlayerTurn || !event.target.classList.contains("cell")) {
      return;
    }

    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    const result = playerTwo.playersGameboard.receiveAttack(x, y);

    if (result && result.includes("Error")) {
      alert("You have already attacked this cell. Please choose a different target.");
      return;
    }

    if (result === "Success: Hit!") {
      event.target.classList.add("hit");
      for (const shipData of playerTwo.playersShips) {
        if (
          shipData.ship.coordinates.some(
            (coord) => coord[0] === x && coord[1] === y,
          )
        ) {
          shipData.ship.hit();
          if (shipData.ship.isSunk()) {
            alert(`You sunk the computer's ${shipData.ship.name}!`);
            populateCellsForSunkShip(shipData.ship, computerBoard, playerTwo);
          }
          break;
        }
      }
      domController.populateBoards();
      if (playerTwo.playersGameboard.allShipsSunk()) {
        document.getElementById("reset-btn").style.display = "inline-block";
        alert("Player wins!");
        computerBoard.removeEventListener("click", handler);
      }
      return;
    } else if (result === "Success: Miss!") {
      event.target.classList.add("miss");
    }

    domController.populateBoards();

    if (playerTwo.playersGameboard.allShipsSunk()) {
      document.getElementById("reset-btn").style.display = "inline-block";
      alert("Player wins!");
      computerBoard.removeEventListener("click", handler);
      return;
    }
    
    isPlayerTurn = false;

    setTimeout(function aiTurn() {
      if (achievedHit && cordsThatWereHit && cordsThatWereHit.length > 0) {
        if (!possibleAttacks || possibleAttacks.length === 0) {
          const lastHit = cordsThatWereHit.at(-1);
          let adjacentCells = [
            [lastHit[0] - 1, lastHit[1]],
            [lastHit[0] + 1, lastHit[1]],
            [lastHit[0], lastHit[1] - 1],
            [lastHit[0], lastHit[1] + 1],
          ];

          if (cordsThatWereHit.length >= 2) {
            if (cordsThatWereHit[0][0] === cordsThatWereHit[1][0]) {
              adjacentCells = adjacentCells.filter(([x, y]) => x === cordsThatWereHit[0][0]);
            } else if (cordsThatWereHit[0][1] === cordsThatWereHit[1][1]) {
              adjacentCells = adjacentCells.filter(([x, y]) => y === cordsThatWereHit[0][1]);
            }
          }

          possibleAttacks = adjacentCells.filter(([x, y]) => {
            return (
              x >= 0 &&
              x < 10 &&
              y >= 0 &&
              y < 10 &&
              !playerOne.playersGameboard.board[y][x].toString().match(/x|o/)
            );
          });

          if (possibleAttacks.length === 0) {
            cordsThatWereHit.pop();
            if (cordsThatWereHit.length === 0) {
              achievedHit = false;
            }
            setTimeout(aiTurn, 10); // Added delay to prevent stack overflow
            return;
          }
        }

        const { coordinates, result } = playerTwo.makeGuidedAttack(
          playerOne.playersGameboard,
          possibleAttacks,
        );
        
        if (result === "Success: Hit!") {
          const hitShipData = playerOne.playersShips.find((shipData) =>
            shipData.ship.coordinates.some(
              (coord) =>
                coord[0] === coordinates[0] && coord[1] === coordinates[1],
            ),
          );

          if (hitShipData) {
            hitShipData.ship.hit();
          }

          if (hitShipData && hitShipData.ship.isSunk()) {
            achievedHit = false;
            cordsThatWereHit = [];
            possibleAttacks = [];
            populateCellsForSunkShip(hitShipData.ship, playerBoard, playerOne);
            alert(`The computer sunk your ${hitShipData.ship.name}!`); // Added missing alert for guided attacks
          } else {
            cordsThatWereHit.push(coordinates);
            possibleAttacks = [];
          }
          
          domController.populateBoards();
          if (playerOne.playersGameboard.allShipsSunk()) {
            document.getElementById("reset-btn").style.display = "inline-block";
            computerBoard.removeEventListener("click", handler);
            alert("Computer wins!");
            domController.populateComputersBoardOnWin();
            return;
          }
          setTimeout(aiTurn, 500);
          return;

        } else if (result === "Success: Miss!") {
          possibleAttacks.pop();
        } else {
          possibleAttacks.pop();
          setTimeout(aiTurn, 10); // Added delay to prevent stack overflow
          return;
        }
      } else {
        const { coordinates, result } = playerTwo.makeRandomAttack(
          playerOne.playersGameboard,
        );
        if (result === "Success: Hit!") {
          const hitShipData = playerOne.playersShips.find((shipData) =>
            shipData.ship.coordinates.some(
              (coord) =>
                coord[0] === coordinates[0] && coord[1] === coordinates[1],
            ),
          );

          if (hitShipData) {
            hitShipData.ship.hit();
          }

          if (hitShipData && hitShipData.ship.isSunk()) {
            achievedHit = false;
            cordsThatWereHit = [];
            possibleAttacks = [];
            populateCellsForSunkShip(hitShipData.ship, playerBoard, playerOne);
            alert(`The computer sunk your ${hitShipData.ship.name}!`);
          } else {
            achievedHit = true;
            cordsThatWereHit = [coordinates];
            possibleAttacks = [];
          }
          
          domController.populateBoards();
          if (playerOne.playersGameboard.allShipsSunk()) {
            document.getElementById("reset-btn").style.display = "inline-block";
            computerBoard.removeEventListener("click", handler);
            alert("Computer wins!");
            return;
          }
          setTimeout(aiTurn, 500);
          return;
        } else if (result && result.includes("Error")) {
          setTimeout(aiTurn, 10);
          return;
        }
      }

      domController.populateBoards();

      if (playerOne.playersGameboard.allShipsSunk()) {
        document.getElementById("reset-btn").style.display = "inline-block";
        computerBoard.removeEventListener("click", handler);
        alert("Computer wins!");
        return;
      }

      isPlayerTurn = true;
    }, 500);
  });
}

function changeTurn(currentPlayer, opponent) {
  return currentPlayer === "playerOne" ? "playerTwo" : "playerOne";
}

export { startGame, changeTurn };