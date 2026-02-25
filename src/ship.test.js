import Ship from './ship';

test('Ship is a function', () => {
  expect(typeof Ship).toBe('function');
});

test('Ship has correct length', () => {
  const ship = Ship('carrier');
  expect(ship.length).toBe(5);
});

test('Ship hit function increments hits', () => {
    const ship = Ship('destroyer');
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('Ship isSunk returns true when hits equal length', () => {
    const ship = Ship('submarine');
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('Ship isSunk returns false when hits less than length', () => {
    const ship = Ship('cruiser');
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});