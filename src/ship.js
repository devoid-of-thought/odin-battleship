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
  let coordinates = [];
  function setPosition(xPos, yPos, rot) {
    x = xPos;
    y = yPos;
    rotation = rot;
    for (let i = 0; i < length; i++) {
      if (rotation === "0") {
        coordinates.push([x + i, y]);
      } else {
        coordinates.push([x, y + i]);
      }
    }
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
    coordinates,
    hit,
    isSunk,
  };
}

export default Ship;
