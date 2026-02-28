function Ship(type) {
  const name = type;
  const length = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  }[type];

  let x;
  let y;
  let rotation;

  function setPosition(xPos, yPos, rot) {
    x = xPos;
    y = yPos;
    rotation = rot;
  }
  let hits = 0;
  function hit() {
    hits += 1;
  }

  function isSunk() {
    return hits >= length;
  }

  return {
    setPosition,
    name,
    length,
    hit,
    isSunk,
  };
}

export default Ship;
