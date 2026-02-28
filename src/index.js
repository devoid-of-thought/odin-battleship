// Add your JavaScript code here
import "./styles.css";

import { createDom } from "./createDom.js";
import { Player, computerPlayer } from "./player.js";

const playerOne = Player();
const playerTwo = computerPlayer();
playerTwo.populateComputerBoard();


createDom(playerOne, playerTwo);
