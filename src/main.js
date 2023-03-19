console.log('Update Complete!');
var harversterLogic = require('harvesterLogic');
var builderLogic = require('builderLogic');
var upgraderLogic = require('upgraderLogic');
var spawner = require('creepSpawner');

//BIG CHANGE

module.exports.loop = function () {
    if (!Game.spawns['Spawn1']) { return; }
    let spawn = Game.spawns['Spawn1'];
    // console.log("Ticks " + Game.time);

    var requiredAmountOfBuilders = 3;
    var requiredAmountOfUpgraders = 1;
    var requiredAmountOfHarvesters = spawn.room.find(FIND_SOURCES).length + 2;

    var currentHarvesters = spawn.room.find(FIND_MY_CREEPS,
        { filter: (creep) => creep.memory.group == 'H' }
    );

    var currentBuilders = spawn.room.find(FIND_MY_CREEPS,
        { filter: (creep) => creep.memory.group == 'B' }
    );

    var currentUpgraders = spawn.room.find(FIND_MY_CREEPS,
        { filter: (creep) => creep.memory.group == 'U' }
    );

    // console.log("upgraders: " + currentUpgraders.length + " builders: " + currentBuilders.length + " harvesters: " + currentHarvesters.length);

    var useLowResorceMode = false;
    var DEBUG = false;
    if (DEBUG) {

        var debugCreepCount = 0;
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.group == 'DB') { debugCreepCount++; }
        }

        if (debugCreepCount < 1) {
            var newName = 'W1C1M1:[DB]' + Game.time;
            console.log('Spawning new debug: ' + newName);
            var res = spawner.SpawnNewCreep(spawn, 1, 2, 1, 'H');
            console.log(res);
        }
    }


    if (!spawn.spawning && !DEBUG) {
        if (currentUpgraders.length < requiredAmountOfUpgraders && !useLowResorceMode) {
            var newName = 'W1C1M1:[U]' + Game.time;
            useLowResorceMode = true;
            console.log('Spawning new upgrader: ' + newName);
            var res = spawner.SpawnNewCreep(spawn, 1, 2, 1, 'U');
        }

        if ((currentHarvesters.length < requiredAmountOfHarvesters) && !useLowResorceMode) {
            useLowResorceMode = true;
            var newName = 'W1C1M1[H]' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            var res = spawner.SpawnNewCreep(spawn, 1, 2, 1, 'H');
        }
        if (currentBuilders.length < requiredAmountOfBuilders && !useLowResorceMode) {
            var newName = 'W1C1M1[B]' + Game.time;
            useLowResorceMode = true;
            console.log('Spawning new builder: ' + newName);
            var res = spawner.SpawnNewCreep(spawn, 1, 2, 1, 'B');
        }

    }


    var buildJobCount = spawn.room.find(FIND_CONSTRUCTION_SITES).length;


    useLowResorceMode = false;

    var creeps = Game.creeps;
    for (var name in creeps) {
        var creep = creeps[name];

        switch (creep.memory.group) {
            case 'H':
                harversterLogic.run(creep, spawn);
                break;
            case 'B':
                builderLogic.run(creep, spawn, useLowResorceMode);
                break;
            case 'U':
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






    {//UI Code
        var updateString = "Update: " + Game.time;
        var totalEnergy = "Energy: " + spawn.room.energyAvailable + "/" + spawn.room.energyCapacityAvailable;

        var goodColor = 'green';
        var badColor = 'red';
        var manyJobs = 'yellow';
        var tooManyJobs = 'orange';

        var manyJobsThreshold = 5;
        var tooManyJobsThreshold = 10;

        var isHarvingGood = currentHarvesters.length >= requiredAmountOfHarvesters;
        var isBuildingGood = currentBuilders.length >= requiredAmountOfBuilders;
        var isUpgradingGood = currentUpgraders.length >= requiredAmountOfUpgraders;


        if (buildJobCount > tooManyJobsThreshold) {
            isBuildingGood = false;
        } else if (buildJobCount > manyJobsThreshold) {
            isBuildingGood = manyJobs;
        }



        var harvesterColor = isHarvingGood ? goodColor : badColor;
        var builderColor = isBuildingGood ? goodColor : badColor;
        var upgraderColor = isUpgradingGood ? goodColor : badColor;
        var jobsColor = buildJobCount > 0 ? goodColor : badColor;

        var row = 15;
        var harvesterString = "Harvesters: " + currentHarvesters.length + "/" + requiredAmountOfHarvesters;
        new RoomVisual('').text("----STATUS----", 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text(updateString, 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text(harvesterString, 10, row++, { color: harvesterColor, font: 0.8 });
        new RoomVisual('').text("Builders: " + currentBuilders.length + "/" + requiredAmountOfBuilders, 10, row++, { color: builderColor, font: 0.8 });
        new RoomVisual('').text("Upgraders: " + currentUpgraders.length + "/" + requiredAmountOfUpgraders, 10, row++, { color: upgraderColor, font: 0.8 });
        new RoomVisual('').text("Build Jobs: " + buildJobCount, 10, row++, { color: builderColor, font: 0.8 });
        new RoomVisual('').text(totalEnergy, 10, row++, { color: 'green', font: 0.8 });

        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            new RoomVisual('').text('Spawning: ' + spawningCreep.memory.group, 10, row++, { color: 'green', font: 0.8 });
        } else {
            new RoomVisual('').text('Spawning: None', 10, row++, { color: 'green', font: 0.8 });
        }


        //print creep names, for debugging
        new RoomVisual('').text("---Creeps---", 10, row++, { color: 'green', font: 0.8 });

        for (var name in Game.creeps) {
            new RoomVisual('').text(name, 10, row++, { color: 'green', font: 0.8 });
        }

    }

}