console.log('Update Complete!');
var harversterLogic = require('harvesterLogic');
var builderLogic = require('builderLogic');
var upgraderLogic = require('upgraderLogic');
var spawner = require('creepSpawner');



function ClearUnusedMemory() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}


function ClearMemoryOfStorage(room) {
    var storage = room.find(FIND_SOURCES);
    for (var i = 0; i < storage.length; i++) {
        storage[i].memory = {};
    }
}



function GetStringFromErrorCode(errorCode) {
    switch (errorCode) {
        case OK:
            return "OK";
        case ERR_NOT_OWNER:
            return "ERR_NOT_OWNER";
        case ERR_BUSY:
            return "ERR_BUSY";
        case ERR_NOT_FOUND:
            return "ERR_NOT_FOUND";
        case ERR_NOT_ENOUGH_RESOURCES:
            return "ERR_NOT_ENOUGH_RESOURCES";
        case ERR_NOT_ENOUGH_ENERGY:
            return "ERR_NOT_ENOUGH_ENERGY";
        case ERR_INVALID_TARGET:
            return "ERR_INVALID_TARGET";
        case ERR_FULL:
            return "ERR_FULL";
        case ERR_NOT_IN_RANGE:
            return "ERR_NOT_IN_RANGE";
        case ERR_NAME_EXISTS:
            return "ERR_NAME_EXISTS";
        case ERR_NO_BODYPART:
            return "ERR_NO_BODYPART";
        case ERR_NOT_ENOUGH_EXTENSIONS:
            return "ERR_NOT_ENOUGH_EXTENSIONS";
        case ERR_RCL_NOT_ENOUGH:
            return "ERR_RCL_NOT_ENOUGH";
        case ERR_GCL_NOT_ENOUGH:
            return "ERR_GCL_NOT_ENOUGH";
        default:
            return "UNKNOWN ERROR CODE: " + errorCode;
    }
}


// ------------------------------------------------ CREEP SPAWNING LOGIC ------------------------------------------------

function GetMyLevel() {
    //return the amout of extentions
    var extensions = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    return extensions.length;
}

// BODY COUNTS                                       BODY COUNTS

function GetHarvesterBodyPartsCounts(level) {
    switch (level) {
        case 0:
            return { works: 1, carries: 1, moves: 1 };
        case 1: // 
            return { works: 3, carries: 2, moves: 2 };
        case 2: //
            return { works: 5, carries: 3, moves: 3 };
        case 3: //
            return { works: 7, carries: 4, moves: 4 };
        case 4: //
            return { works: 9, carries: 5, moves: 5 };
        case 5: //
            return { works: 11, carries: 6, moves: 6 };
        default:
            console.log("ERROR: GetHarvesterBodyPartsCounts: level not found" + level);
            return { works: 1, carries: 1, moves: 1 };
    }
}

function GetBuilderBodyPartsCounts(level) {
    switch (level) {
        case 0:
            return { works: 1, carries: 1, moves: 1 };
        case 1: // 
            return { works: 3, carries: 2, moves: 2 };
        case 2: //
            return { works: 5, carries: 3, moves: 3 };
        case 3: //
            return { works: 7, carries: 4, moves: 4 };
        case 4: //
            return { works: 9, carries: 5, moves: 5 };
        case 5: //
            return { works: 11, carries: 6, moves: 6 };
        default:
            console.log("ERROR: GetBuilderBodyPartsCounts: level not found" + level);
            return { works: 1, carries: 1, moves: 1 };
    }
}

function GetUpgraderBodyPartsCounts(level) {
    switch (level) {
        case 0:
            return { works: 1, carries: 1, moves: 1 };
        case 1: // 
            return { works: 3, carries: 2, moves: 2 };
        case 2: //
            return { works: 5, carries: 3, moves: 3 };
        case 3: //
            return { works: 7, carries: 4, moves: 4 };
        case 4: //
            return { works: 9, carries: 5, moves: 5 };
        case 5: //
            return { works: 11, carries: 6, moves: 6 };

        default:
            console.log("ERROR: GetUpgraderBodyPartsCounts: level not found" + level);
            return { works: 1, carries: 1, moves: 1 };
    }
}

// CREEP COUNTS                                       CREEP COUNTS



// ------------------------------------------------ CREEP SPAWNING LOGIC ------------------------------------------------

module.exports.loop = function () {
    if (!Game.spawns['Spawn1']) { return; }
    let spawn = Game.spawns['Spawn1'];
    ClearUnusedMemory();
    ClearMemoryOfStorage(spawn.room);
    spawn.memory.beingUsed = false;


    const requiredAmountOfBuilders = 3;
    const requiredAmountOfUpgraders = 1;
    const requiredAmountOfHarvesters = spawn.room.find(FIND_SOURCES).length;

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
    var resorceResion = "Normal";
    var resorceGoal = "Normal";
    var DEBUG = false;


    if (!spawn.spawning && !DEBUG) {
        if (currentUpgraders.length < requiredAmountOfUpgraders && !useLowResorceMode) {
            useLowResorceMode = true;
            resorceResion = "Spawn Upgrader";
            var parts = GetUpgraderBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            var res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'U');
            resorceGoal = spawner.GetCreepCost(parts.works, parts.carries, parts.moves);
        }

        if ((currentHarvesters.length < requiredAmountOfHarvesters) && !useLowResorceMode) {
            useLowResorceMode = true;
            var parts = GetHarvesterBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            resorceResion = "Spawn Harvester";
            var res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'H');
            resorceGoal = spawner.GetCreepCost(parts.works, parts.carries, parts.moves);

        }
        if (currentBuilders.length < requiredAmountOfBuilders && !useLowResorceMode) {
            useLowResorceMode = true;
            resorceResion = "Spawn Builder";
            var parts = GetBuilderBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            var res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'B');
            resorceGoal = spawner.GetCreepCost(parts.works, parts.carries, parts.moves);
        }

    }

    var buildJobCount = spawn.room.find(FIND_CONSTRUCTION_SITES).length;



    var creeps = Game.creeps;
    for (var name in creeps) {
        var creep = creeps[name];

        switch (creep.memory.group) {
            case 'H':
                harversterLogic.run(creep, spawn);
                break;
            case 'B':
                if (useLowResorceMode) {
                    harversterLogic.run(creep, spawn);
                    break;
                }
                builderLogic.run(creep, spawn, useLowResorceMode);
                break;
            case 'U':
                // if (useLowResorceMode) {
                //     harversterLogic.run(creep, spawn);
                //     break;
                // }
                upgraderLogic.run(creep, spawn, useLowResorceMode);
                break;
            case undefined:
                console.log("Undefined creep role: " + creep.name);
                break;
            default:
                console.log("Unknown creep role: " + creep.name + " " + creep.memory.group);
                break;
        }
    }


    {//UI Code
        var updateString = "Update: " + Game.time;
        var totalEnergy = "Energy: " + spawn.room.energyAvailable + "/" + spawn.room.energyCapacityAvailable;

        var goodColor = 'green';
        var badColor = 'red';
        var energyColor = 'yellow'


        var isHarvingGood = currentHarvesters.length >= requiredAmountOfHarvesters;
        var isBuildingGood = currentBuilders.length >= requiredAmountOfBuilders;
        var isUpgradingGood = currentUpgraders.length >= requiredAmountOfUpgraders;

        var harvesterColor = isHarvingGood ? goodColor : badColor;
        var builderColor = isBuildingGood ? goodColor : badColor;
        var upgraderColor = isUpgradingGood ? goodColor : badColor;

        var row = 10;
        var harvesterString = "Harvesters: " + currentHarvesters.length + "/" + requiredAmountOfHarvesters;
        new RoomVisual('').text("----LEVEL----", 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("Level: " + GetMyLevel(), 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("----STATUS----", 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text(updateString, 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text(harvesterString, 10, row++, { color: harvesterColor, font: 0.8 });
        new RoomVisual('').text("Builders: " + currentBuilders.length + "/" + requiredAmountOfBuilders, 10, row++, { color: builderColor, font: 0.8 });
        new RoomVisual('').text("Upgraders: " + currentUpgraders.length + "/" + requiredAmountOfUpgraders, 10, row++, { color: upgraderColor, font: 0.8 });
        new RoomVisual('').text("Build Jobs: " + buildJobCount, 10, row++, { color: builderColor, font: 0.8 });
        new RoomVisual('').text(totalEnergy, 10, row++, { color: energyColor, font: 0.8 });

        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            new RoomVisual('').text('Spawning: ' + spawningCreep.memory.group, 10, row++, { color: 'green', font: 0.8 });
        } else {
            new RoomVisual('').text('Spawning: None', 10, row++, { color: 'green', font: 0.8 });
        }

        new RoomVisual('').text("---RESOURCE INFO---", 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("Low Resorce Mode: " + useLowResorceMode, 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("Resorce Goal: " + resorceGoal, 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("Resorce Resion: " + resorceResion, 10, row++, { color: 'green', font: 0.8 });

        //print creep group and name for debugging
        new RoomVisual('').text("---Creeps---", 10, row++, { color: 'green', font: 0.8 });
        for (var name in creeps) {
            var creep = creeps[name];
            new RoomVisual('').text(creep.memory.group + ": " + creep.name, 10, row++, { color: 'green', font: 0.8 });
        }

    }

}