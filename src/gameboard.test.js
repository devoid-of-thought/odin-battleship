import Gameboard from "./gameboard";
import Ship from "./ship";
test("Gameboard initializes with a 10x10 grid", () => {
  const gameboard = Gameboard();
  gameboard.initializeBoard();
  expect(gameboard.board.length).toBe(10);
  gameboard.board.forEach((row) => {
    expect(row.length).toBe(10);
    row.forEach((cell) => {
      expect(cell).toBe(0);
    });
  });
});

test("Gameboard places a ship correctly", () => {
  const gameboard = Gameboard();
  const ship = Ship("destroyer");
  const result = gameboard.placeShip(ship, 0, 0, "0");
  expect(result).toBe("Success: Ship placed successfully!");
  expect(gameboard.board[0][0]).toBe(1);
  expect(gameboard.board[0][1]).toBe(1);
});

test("Gameboard prevents placing a ship on top of another", () => {
  const gameboard = Gameboard();
  const ship1 = Ship("destroyer");
  const ship2 = Ship("submarine");
  gameboard.placeShip(ship1, 0, 0, "0");
  const result = gameboard.placeShip(ship2, 0, 0, "1");
  expect(result).toBe("Error: Cannot place ship here.");
});

test("Gameboard prevents placing a ship out of bounds", () => {
  const gameboard = Gameboard();
  const ship = Ship("carrier");
  const result = gameboard.placeShip(ship, 8, 0, "0");
  expect(result).toBe("Error: Cannot place ship here.");
});

test("Gameboard prevents placing a ship out of bounds vertically", () => {
  const gameboard = Gameboard();
  const ship = Ship("carrier");
  const result = gameboard.placeShip(ship, 0, 8, "1");
  expect(result).toBe("Error: Cannot place ship here.");
});

test("Gameboard prevents attacks out of bounds", () => {
  const gameboard = Gameboard();
  const result = gameboard.receiveAttack(10, 10);
  expect(result).toBe("Error: Attack out of bounds.");
});

test("Gameboard upon receiving an attack that is a hit, updates the board correctly", () => {
  const gameboard = Gameboard();
  const ship = Ship("destroyer");
  gameboard.placeShip(ship, 0, 0, "0");
  gameboard.receiveAttack(0, 0);
  expect(gameboard.board[0][0]).toBe("x");
});
test("Gameboard upon receiving an attack that is a miss, updates the board correctly", () => {
  const gameboard = Gameboard();
  gameboard.receiveAttack(0, 0);
  expect(gameboard.board[0][0]).toBe("o");
});
test("Gameboard receives an attack", () => {
  const gameboard = Gameboard();
  const ship = Ship("destroyer");
  gameboard.placeShip(ship, 0, 0, "0");
  const result = gameboard.receiveAttack(0, 0);
  expect(result).toBe("Success: Hit!");
});
test("Gameboard receives a miss", () => {
  const gameboard = Gameboard();
  const result = gameboard.receiveAttack(0, 0);
  expect(result).toBe("Success: Miss!");
});
test("All ships are sunk", () => {
  const gameboard = Gameboard();
  const ship = Ship("destroyer");
  gameboard.placeShip(ship, 0, 0, "0");
  gameboard.receiveAttack(0, 0);
  expect(gameboard.allShipsSunk()).toBe(false);
});
test("All ships are sunk after all parts are hit", () => {
  const gameboard = Gameboard();
  const ship = Ship("destroyer");
  gameboard.placeShip(ship, 0, 0, "0");
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  expect(gameboard.allShipsSunk()).toBe(true);
});

test("Gameboard prevents placing a ship adjacent to another", () => {
  const gameboard = Gameboard();
  const ship1 = Ship("destroyer");
  const ship2 = Ship("submarine");

  gameboard.placeShip(ship1, 0, 0, "0");

  const result = gameboard.placeShip(ship2, 0, 1, "1");
  expect(result).toBe("Error: Cannot place ship here.");
});

test("Gameboard allows placing a ship with one cell gap", () => {
  const gameboard = Gameboard();
  const ship1 = Ship("destroyer");
  const ship2 = Ship("submarine");

  gameboard.placeShip(ship1, 0, 0, "0");

  const result = gameboard.placeShip(ship2, 0, 3, "1");
  expect(result).toBe("Success: Ship placed successfully!");
});
