
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
    GetCreepCost: function (workCount, carryCount, moveCount) {
        var bodyCost = (workCount + carryCount + moveCount) * 100;
        return bodyCost;
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

        // console.log(JSON.stringify(body));

        var bodyCost = (workCount + carryCount + moveCount) * 100;

        var powerAvailable = spawn.room.energyAvailable;


        // console.log("Cost " + bodyCost + " Parts: " + body.length +
        //     " Body: " + JSON.stringify(body) + " Power Available: " + powerAvailable +
        //     " Name " + newName);

        var res = SpawnNewCreep(spawn, body, newName, { memory: { group: group } });
        return res;
    }
};

module.exports = creepSpawner;