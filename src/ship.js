function Ship(type) {
  const length = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  }[type];

  let hits = 0;
  function hit() {
    hits += 1;
  }

  function isSunk() {
    return hits >= length;
  }

  return {
    length,
    hit,
    isSunk,
  };
}

module.exports = Ship;
