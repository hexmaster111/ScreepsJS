
//set the name of the creep
//the name is made up of 3 parts:
// Wxx - the 'WORK" part of the creep
// Cxx - the 'CARRY' part of the creep
// Mxx - the 'MOVE' part of the creep
// [G] - the group of the creep
// var workParts = creep.body.filter(p => p.type == WORK).length;
// var carryParts = creep.body.filter(p => p.type == CARRY).length;
// var moveParts = creep.body.filter(p => p.type == MOVE).length;
// var newName = "W" + workParts + "C" + carryParts + "M" + moveParts + "[B]";

var bodyCost = {
    "move": 50,
    "carry": 50,
    "work": 100,
    "heal": 250,
    "tough": 10,
    "attack": 80,
    "ranged_attack": 150,
    "claim": 600,
};


function SpawnNewCreep(spawn, body, name, args) {
    return spawn.spawnCreep(body, name, args);
}




function GetName(workCount, carryCount, moveCount, group) {
    var gametime = Game.time;

    //Make the game time only 4 digits
    var gametimeString = gametime.toString();
    var gametimeLength = gametimeString.length;
    if (gametimeLength > 4) {
        gametimeString = gametimeString.substring(gametimeLength - 4, gametimeLength);
    }

    var newName = "W" + workCount + "C" + carryCount + "M" + moveCount + "[" + group + "]" + gametimeString;
    return newName;
}

var creepSpawner = {
    GetCreepCost: function (workCount, carryCount, moveCount, heal, tough, attack, ranged_attack) {
        var cost = 0;
        if (workCount) cost += workCount * bodyCost["work"];
        if (carryCount) cost += carryCount * bodyCost["carry"];
        if (moveCount) cost += moveCount * bodyCost["move"];
        if (heal) cost += heal * bodyCost["heal"];
        if (tough) cost += tough * bodyCost["tough"];
        if (attack) cost += attack * bodyCost["attack"];
        if (ranged_attack) cost += ranged_attack * bodyCost["ranged_attack"];
        return cost;
    },

    SpawnNewCreep: function (spawn, workCount, carryCount, moveCount, group) {
        var newName = GetName(workCount, carryCount, moveCount, group);

        var body = [];
        for (var i = 0; i < workCount; i++) {
            body.push(WORK);
        }
        for (var i = 0; i < carryCount; i++) {
            body.push(CARRY);
        }
        for (let index = 0; index < moveCount; index++) {
            body.push(MOVE);
        }


        var res = SpawnNewCreep(spawn, body, newName, { memory: { group: group } });
        return res;
    }
};

module.exports = creepSpawner;