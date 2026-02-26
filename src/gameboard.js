import { logError, logSuccess } from "./helperFunctions.js";

function Gameboard() {
  const board = [];

  function initializeBoard() {
    board.length = 0;
    for (let i = 0; i < 10; i++) {
    
      board.push(new Array(10).fill(0));
    }
  }
  initializeBoard();

  function checkIfEligible(length, x, y, rotation) {
    if (x >= 10 || x <0 || y >=10 || y < 0) {
        return false;
    }
    if (rotation === "0" && x + length > 10) {
      return false;
    }
    if (rotation === "1" && y + length > 10) {
      return false;
    }
    if (rotation === "0") {
      for (let i = 0; i < length; i++) {
        if (board[y][x + i] === 1) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        if (board[y + i][x] === 1) {
          return false;
        }
      }
    }
    return true;
  }

  function placeShip(ship, x, y, rotation) {
    const length = ship.length;

    if (!checkIfEligible(length, x, y, rotation)) {
      return logError("Cannot place ship here");
    }
    if (rotation === "0") {
      for (let i = 0; i < length; i++) {
        board[y][x + i] = 1;
      }
    } else {
      for (let i = 0; i < length; i++) {
        board[y + i][x] = 1;
      }
    }
    return logSuccess("Ship placed successfully");
  }


  return {
    board,
    placeShip,
    initializeBoard,
  };
}

module.exports = Gameboard;
