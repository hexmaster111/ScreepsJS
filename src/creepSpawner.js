
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

var creepSpawner = {
    SpawnNewCreep: function (spawn, workCount, carryCount, moveCount, group) {
        var newName = "W" + workCount + "C" + carryCount + "M" + moveCount + "[" + group + "]";
        console.log('Spawning new creep: ' + newName);
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

        const partCost = 100;
        var cost = 300; //300 is base cost
        var bodyCost = (workCount + carryCount + moveCount) * partCost;
        cost += bodyCost;

        var powerAvailable = spawn.room.energyAvailable;


        console.log("Cost of body: " + bodyCost + " Power Available: " + powerAvailable + " Cost: " + cost);

        return spawn.spawnCreep(body, newName,
            { memory: { role: 'builder', group: group } }
        );

    }
};

module.exports = creepSpawner;