// Add your JavaScript code here
import "./styles.css";

import { createDom } from "./createDom.js";
import { Player, computerPlayer } from "./player.js";
import { startGame } from "./gameLogic.js";

const playerOne = Player();
const playerTwo = computerPlayer();

playerTwo.populateComputerBoard();

const domController = createDom(playerOne, playerTwo);

const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.classList.add("btn");
startButton.id = "start-btn";
document.querySelector(".buttons-container").prepend(startButton);

const resetButton = document.createElement("button");
resetButton.textContent = "Reset Game";
resetButton.classList.add("btn");
resetButton.id = "reset-btn";
document.querySelector(".buttons-container").prepend(resetButton);

startButton.addEventListener("click", () => {
    if (playerOne.playersShips.every(ship => ship.placed)) {
        const shipListContainer = document.getElementById("ship-list-container");
        shipListContainer.style.display = "none";
        startGame(playerOne, playerTwo, domController);
        startButton.disabled = true;
        startButton.remove();
        resetButton.style.display = "none";
    } else {
        alert("Please place all your ships before starting the game!");
    }
});

resetButton.addEventListener("click", () => {
    location.reload();
});

