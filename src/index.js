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
const domController = createDom(playerOne, playerTwo);

const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.id = "start-btn";
document.body.prepend(startButton);

startButton.addEventListener("click", () => {
    if (playerOne.playersShips.every(ship => ship.placed)) {
        startGame(playerOne, playerTwo, domController);
        startButton.disabled = true;
        startButton.remove();
    } else {
        alert("Please place all your ships before starting the game!");
    }
});



