function startGame(playerOne, playerTwo, domController) {
  let isPlayerTurn = true;
  let achievedHit = false;
  let targetCords;
  let cordsThatWereHit;
  let possibleAttacks;
  const computerBoard = document.getElementById("player-two-board");

  function populateCellsForSunkShip(ship, coordinates) {
    for (const coord of ship.coordinates) {
      const aroundCells = [
        [coord[0] - 1, coord[1]], // left
        [coord[0] + 1, coord[1]], // right
        [coord[0], coord[1] - 1], // up
        [coord[0], coord[1] + 1], // down
        [coord[0] - 1, coord[1] - 1], // up-left
        [coord[0] + 1, coord[1] - 1], // up-right
        [coord[0] - 1, coord[1] + 1], // down-left
        [coord[0] + 1, coord[1] + 1], // down-right
      ];
      aroundCells.forEach(([x, y]) => {
        if (x >= 0 && x < 10 && y >= 0 && y < 10) {
          const aroundCell = computerBoard.querySelector(
            `.cell[data-x="${x}"][data-y="${y}"]`,
          );
          if (
            aroundCell &&
            !aroundCell.classList.contains("hit") &&
            !aroundCell.classList.contains("miss")
          ) {
            playerTwo.playersGameboard.receiveAttack(x, y);
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

    if (result === "Error: This cell has already been attacked") {
      alert(
        "You have already attacked this cell. Please choose a different target.",
      );
      return;
    }

    if (result === "Success: Hit!") {
      event.target.classList.add("hit");
      isPlayerTurn = true;
      for (const ship of playerTwo.playersShips) {
        if (
          ship.ship.coordinates.some(
            (coord) => coord[0] === x && coord[1] === y,
          )
        ) {
          ship.ship.hit();
          if (ship.ship.isSunk()) {
            alert(`You sunk the computer's ${ship.ship.name}!`);
            populateCellsForSunkShip(ship.ship, ship.ship.coordinates);
          }
          break;
        }
      }
    } else if (result === "Success: Miss!") {
      event.target.classList.add("miss");
    }

    domController.populateBoards();

    if (playerTwo.playersGameboard.allShipsSunk()) {
      alert("Player wins!");
      computerBoard.removeEventListener("click", handler);
      return;
    }
    isPlayerTurn = false;

    setTimeout(() => {
      if (achievedHit) {
        if (possibleAttacks === undefined || possibleAttacks.length === 0) {
          console.log("Cords that were hit:", cordsThatWereHit);
          const adjacentCells = [
            [cordsThatWereHit.at(-1)[0] - 1, cordsThatWereHit.at(-1)[1]],
            [cordsThatWereHit.at(-1)[0] + 1, cordsThatWereHit.at(-1)[1]],
            [cordsThatWereHit.at(-1)[0], cordsThatWereHit.at(-1)[1] - 1],
            [cordsThatWereHit.at(-1)[0], cordsThatWereHit.at(-1)[1] + 1],
          ];

          
          possibleAttacks = adjacentCells.filter(([x, y]) => {
            return (
              x >= 0 &&
              x < 10 &&
              y >= 0 &&
              y < 10 &&
              !playerOne.playersGameboard.board[y][x].toString().match(/x|o/)
            );
          });
        }

        console.log("Possible attacks:", possibleAttacks);
        const { coordinates, result } = playerTwo.makeGuidedAttack(
          playerOne.playersGameboard,
          possibleAttacks,
        );
        if (result === "Success: Hit!") {
          const hitShip = playerOne.playersShips.find((shipData) =>
            shipData.ship.coordinates.some(
              (coord) =>
                coord[0] === coordinates[0] && coord[1] === coordinates[1],
            ),
          );

          if (hitShip && hitShip.ship.isSunk()) {
            achievedHit = false;
            populateCellsForSunkShip(hitShip.ship, hitShip.ship.coordinates);
            alert(`The computer sunk your ${hitShip.ship.name}!`);
          } else {
            isPlayerTurn = false;
            achievedHit = true;
            cordsThatWereHit = [...cordsThatWereHit, coordinates];
          }
        } else {
          possibleAttacks = possibleAttacks.slice(0, -1);
        }
      } else {
        const { coordinates, result } = playerTwo.makeRandomAttack(
          playerOne.playersGameboard,
        );
        if (result === "Success: Hit!") {
          isPlayerTurn = false;
          achievedHit = true;
          console.log(coordinates);
          cordsThatWereHit = [coordinates];
        }
        domController.populateBoards();
      }

      if (playerOne.playersGameboard.allShipsSunk()) {
        computerBoard.removeEventListener("click", handler);
        domController.populateBoards();
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
