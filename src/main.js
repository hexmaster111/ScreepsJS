//HELLO WORLD THIS IS FROME THE IDE


module.exports.loop = function () {
    if (!Game.spawns['Spawn1']) { return; }
    let s = Game.spawns['Spawn1'];
    let d = Game.creeps['d'];
    if (!d) {
        s.createCreep([MOVE, CARRY, WORK], 'd'); return;
    }

    if (d.carry['energy'] == 0) {
        d.moveTo(s);
        d.withdraw(s, 'energy');
        return;
    }

    d.moveTo(d.room.controller);
    d.upgradeController(d.room.controller);

};