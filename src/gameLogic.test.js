import {Player, computerPlayer} from "./player.js";
import Gameboard from "./gameboard.js";

import { startGame, changeTurn } from "./gameLogic.js";

test('Round should start only when both players are ready', () => {
    const playerOne = Player();
    const playerTwo = computerPlayer();
    expect(() => startGame(playerOne, playerTwo)).toThrow("Both players must have all their ships placed to start the game.");
});
test('Round should start successfully when both players are ready', () => {
    const playerOne = Player();
    const playerTwo = computerPlayer();
    playerOne.playersShips.forEach(ship => ship.placed = true);
    playerTwo.playersShips.forEach(ship => ship.placed = true);
    expect(() => startGame(playerOne, playerTwo)).not.toThrow();
});

