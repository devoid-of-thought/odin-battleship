// Add your JavaScript code here
import "./styles.css";

import { createDom } from "./createDom.js";
import { Player, computerPlayer } from "./player.js";
import { startGame } from "./gameLogic.js";

const playerOne = Player();
const playerTwo = computerPlayer();

function placeRandomShips(player) {
  player.playersShips.forEach((shipObj) => {
    while (!shipObj.placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const rotation = Math.random() < 0.5 ? "0" : "1";
      const result = player.playersGameboard.placeShip(
        shipObj.ship,
        x,
        y,
        rotation,
      );
      if (result.includes("successfully")) {
        shipObj.ship.setPosition(x, y, rotation);
        shipObj.placed = true;
      }
    }
  });
}

placeRandomShips(playerOne);
playerTwo.populateComputerBoard();

const domController = createDom(playerOne, playerTwo);

const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.classList.add("btn");
startButton.id = "start-btn";
document.body.prepend(startButton);

const resetButton = document.createElement("button");
resetButton.textContent = "Reset Game";
resetButton.classList.add("btn");
resetButton.id = "reset-btn";
resetButton.style.display = "none";
document.body.prepend(resetButton);

startButton.addEventListener("click", () => {
    if (playerOne.playersShips.every(ship => ship.placed)) {
        const shipListContainer = document.getElementById("ship-list-container");
        shipListContainer.style.display = "none";
        startGame(playerOne, playerTwo, domController);
        startButton.disabled = true;
        startButton.remove();
    } else {
        alert("Please place all your ships before starting the game!");
    }
});

resetButton.addEventListener("click", () => {
    location.reload();
});

