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
    if (x >= 10 || x < 0 || y >= 10 || y < 0) {
      return false;
    }
    if (rotation === "0" && x + length > 10) {
      return false;
    }
    if (rotation === "1" && y + length > 10) {
      return false;
    }
    if (rotation === "0") {
      if (x - 1 >= 0 && board[y][x - 1] === 1) {
        return false;
      }
      if (x + length < 10 && board[y][x + length] === 1) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (y + 1 < 10 && board[y + 1][x + i] === 1) {
          return false;
        }
        if (y - 1 >= 0 && board[y - 1][x + i] === 1) {
          return false;
        }
        if (board[y][x + i] === 1) {
          return false;
        }
      }
      if (y - 1 >= 0 && x - 1 >= 0 && board[y - 1][x - 1] === 1) {
        return false;
      }
      if (y - 1 >= 0 && x + length < 10 && board[y - 1][x + length] === 1) {
        return false;
      }
      if (y + 1 < 10 && x - 1 >= 0 && board[y + 1][x - 1] === 1) {
        return false;
      }
      if (y + 1 < 10 && x + length < 10 && board[y + 1][x + length] === 1) {
        return false;
      }
    } else {
      if (y - 1 >= 0 && board[y - 1][x] === 1) {
        return false;
      }
      if (y + length < 10 && board[y + length][x] === 1) {
        return false;
      }
      for (let i = 0; i < length; i++) {
        if (x + 1 < 10 && board[y + i][x + 1] === 1) {
          return false;
        } 
        if (x - 1 >= 0 && board[y + i][x - 1] === 1) {
          return false;
        }
        if (board[y + i][x] === 1) {
          return false;
        }
      }
      if (x - 1 >= 0 && y - 1 >= 0 && board[y - 1][x - 1] === 1) {
        return false;
      }
      if (x - 1 >= 0 && y + length < 10 && board[y + length][x - 1] === 1) {
        return false;
      }
      if (x + 1 < 10 && y - 1 >= 0 && board[y - 1][x + 1] === 1) {
        return false;
      }
      if (x + 1 < 10 && y + length < 10 && board[y + length][x + 1] === 1) {
        return false;
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

  function receiveAttack(x, y) {
    if (x >= 10 || x < 0 || y >= 10 || y < 0) {
      return logError("Attack out of bounds");
    }
    if (board[y][x] === 1) {
      board[y][x] = "x";
      return logSuccess("Hit");
    } else if (board[y][x] === 0) {
      board[y][x] = "o";
      return logSuccess("Miss");
    }
    else {      
      return logError("This cell has already been attacked");
    }
  }
  function allShipsSunk() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (board[i][j] === 1) {
          return false;
        }
      }
    }
    return true;
  }

  return {
    board,
    checkIfEligible,
    placeShip,
    initializeBoard,
    receiveAttack,
    allShipsSunk,
  };
}

export default Gameboard;
