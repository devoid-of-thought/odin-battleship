import Gameboard from "./gameboard.js";
import { logError } from "./helperFunctions.js";
import Ship from "./ship.js";


    function Player(){
        const playersGameboard = Gameboard();
        const playersShips = [];

        const possibleAttacks = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                possibleAttacks.push([i, j]);
            }
        }

        const shipTypes = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
        for (const ship of shipTypes) {
            playersShips.push(
                {
                    ship:Ship(ship),
                    placed: false,
                
                });
        }

        return {
            playersGameboard,
            playersShips,
            possibleAttacks,
        }
    }
    function computerPlayer() {
        const player = Player();
        
        function populateComputerBoard() {
            for (const ship of player.playersShips) {
                while (!ship.placed) {
                    const x = Math.floor(Math.random() * 10);
                    const y = Math.floor(Math.random() * 10);
                    const rotation = Math.random() < 0.5 ? "0" : "1";
                    const result = player.playersGameboard.placeShip(ship.ship, x, y, rotation);
                    if (result.includes("successfully")) {
                        ship.ship.setPosition(x, y, rotation);
                        ship.placed = true;
                    }
                }
            }
        }

        function makeRandomAttack(opponentGameboard) {
            const randomIndex = Math.floor(Math.random() * player.possibleAttacks.length);
            const attackCoordinates = player.possibleAttacks.splice(randomIndex, 1)[0];
            if (!attackCoordinates) {
                return logError("No more possible attacks");
            }
            return opponentGameboard.receiveAttack(attackCoordinates[0], attackCoordinates[1]);
        }

        return {
            ...player,
            makeRandomAttack,
            populateComputerBoard,
        }
    }

export {Player, computerPlayer};
