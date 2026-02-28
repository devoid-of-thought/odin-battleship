import {Player, computerPlayer} from "./player";

test("Player should have a gameboard", ()=>{
    const player = Player();
    expect(player.playersGameboard).toBeDefined();
});
test("Playesr's gameboard should be empty at the start of the game", ()=>{
    const player = Player();
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            expect(player.playersGameboard.board[i][j]).toBe(0);
        }
    }
});

test("Players fleet should be complete",()=>{
    const shipTypes = [5,4,3,3,2];
    const player = Player();
    for (let i = 0; i < shipTypes.length; i++) {
        expect(player.playersShips[i].ship.length).toBe(shipTypes[i]);
    }
});
test("Computer player should have a gameboard", ()=>{
    const computer = computerPlayer();
    expect(computer.playersGameboard).toBeDefined();
});
test("Computer player should have a fleet", ()=>{
    const shipTypes = [5,4,3,3,2];
    const computer = computerPlayer();
    for (let i = 0; i < shipTypes.length; i++) {
        expect(computer.playersShips[i].ship.length).toBe(shipTypes[i]);
    }
});
test("Player should have a list of possible attacks", ()=>{
    const player = Player();
    expect(player.possibleAttacks.length).toBe(100);
});
test("Computer player should make a valid attack", ()=>{
    const computer = computerPlayer();
    const opponent = Player();
    expect(computer.makeRandomAttack(opponent.playersGameboard)).toBeDefined();
});

test("Computer player should not repeat attacks", ()=>{
    const computer = computerPlayer();
    const opponent = Player();
    const initialPossibleAttacksLength = computer.possibleAttacks.length;
    computer.makeRandomAttack(opponent.playersGameboard);
    expect(computer.possibleAttacks.length).toBe(initialPossibleAttacksLength - 1);
});
test("Computer should in the end have no possible attacks left", ()=>{
    const computer = computerPlayer();
    const opponent = Player();
    for (let i = 0; i < 100; i++) {
        computer.makeRandomAttack(opponent.playersGameboard);
    }
    expect(computer.possibleAttacks.length).toBe(0);
});
test("Computer should return 'No more possible attacks' when no attacks are left", ()=>{
    const computer = computerPlayer();
    const opponent = Player();
    for (let i = 0; i < 100; i++) {
        computer.makeRandomAttack(opponent.playersGameboard);
    }
    expect(computer.makeRandomAttack(opponent.playersGameboard)).toBe("Error: No more possible attacks.");
});