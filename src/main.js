console.log('Update Complete!');
var harversterLogic = require('harvesterLogic');
var builderLogic = require('builderLogic');
var upgraderLogic = require('upgraderLogic');

module.exports.loop = function () {
    if (!Game.spawns['Spawn1']) { return; }
    let spawn = Game.spawns['Spawn1'];
    // console.log("Ticks " + Game.time);

    var requiredAmountOfBuilders = 1;
    var requiredAmountOfUpgraders = 1;
    var requiredAmountOfHarvesters = spawn.room.find(FIND_SOURCES).length;

    var currentHarvesters = spawn.room.find(FIND_MY_CREEPS,
        { filter: (creep) => creep.memory.role == 'harvester' }
    );

    var currentBuilders = spawn.room.find(FIND_MY_CREEPS,
        { filter: (creep) => creep.memory.role == 'builder' }
    );

    var currentUpgraders = spawn.room.find(FIND_MY_CREEPS,
        { filter: (creep) => creep.memory.role == 'upgrader' }
    );

    // console.log("upgraders: " + currentUpgraders.length + " builders: " + currentBuilders.length + " harvesters: " + currentHarvesters.length);

    var useLowResorceMode = false;

    if (!spawn.spawning) {
        if ((currentHarvesters.length < requiredAmountOfHarvesters) && !useLowResorceMode) {
            useLowResorceMode = true;
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        }

        if (currentBuilders.length < requiredAmountOfBuilders && !useLowResorceMode) {
            var newName = 'Builder' + Game.time;
            useLowResorceMode = true;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'builder' } });
        }

        if (currentUpgraders.length < requiredAmountOfUpgraders && !useLowResorceMode) {
            var newName = 'Upgrader' + Game.time;
            useLowResorceMode = true;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
    }




    var creeps = Game.creeps;
    for (var name in creeps) {
        var creep = creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                harversterLogic.run(creep, spawn);
                break;
            case 'builder':
                builderLogic.run(creep, spawn, useLowResorceMode);
                break;
            case 'upgrader':
                upgraderLogic.run(creep, spawn, useLowResorceMode);
                break;
            case undefined:
                console.log("Undefined creep role: " + creep.name);
                break;
            default:
                console.log("Unknown creep role: " + creep.name);
                break;
        }
    }
}
