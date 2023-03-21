console.log('Update Complete!');
var harversterLogic = require('harvesterLogic');
var builderLogic = require('builderLogic');
var upgraderLogic = require('upgraderLogic');
var spawner = require('creepSpawner');

//SIM

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
            return { works: 1, carries: 1, moves: 2 }; // PART COST = 200
        case 1: //
            return { works: 1, carries: 1, moves: 2 };
        case 2: //
            return { works: 2, carries: 1, moves: 2 };
        case 3: //
            return { works: 2, carries: 1, moves: 2 };
        case 4: //
            return { works: 2, carries: 1, moves: 3 };
        case 5: //
            return { works: 2, carries: 1, moves: 3 }; // UNPROVEN PAST THIS POINT
        case 6: //
            return { works: 2, carries: 2, moves: 2 };
        case 7: //
            return { works: 2, carries: 2, moves: 2 };
        case 8: //
            return { works: 3, carries: 2, moves: 2 };
        case 9: //
            return { works: 3, carries: 2, moves: 2 };
        case 10: //
            return { works: 3, carries: 2, moves: 3 };
        default:
            console.log("ERROR IN GET HARVTERBODYPARTSCOUNT level not found" + level);
            return GetHarvesterBodyPartsCounts(level - 1);
    }
}






function GetCreepsCountForLevel(level) {

    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    switch (level) {
        case 0:
            return { harvesters: sources.length, builders: 2, upgraders: 1 };
        case 1: //
            return { harvesters: sources.length + 1, builders: 2, upgraders: 2 };
        case 2: //
            return { harvesters: sources.length + 1, builders: 2, upgraders: 2 };
        case 3: //
            return { harvesters: sources.length + 1, builders: 2, upgraders: 2 };
        case 4: //
            return { harvesters: sources.length + 1, builders: 2, upgraders: 2 };
        case 5: //
            return { harvesters: sources.length + 1, builders: 2, upgraders: 2 };
        case 6: //
            return { harvesters: sources.length + 1, builders: 3, upgraders: 2 };
        case 7: // 
            return { harvesters: sources.length + 1, builders: 3, upgraders: 2 };
        case 8: //
            return { harvesters: sources.length + 1, builders: 3, upgraders: 2 };
        case 9: //  
            return { harvesters: sources.length + 1, builders: 3, upgraders: 2 };
        default:
            console.log("ERROR IN GET HARVTERBODYPARTSCOUNT level not found" + level);
            return GetHarvesterBodyPartsCounts(level - 1);

    }
}


function GetBuilderBodyPartsCounts(level) {
    return GetHarvesterBodyPartsCounts(level);
}

function GetUpgraderBodyPartsCounts(level) {
    return GetHarvesterBodyPartsCounts(level);
}

// CREEP COUNTS                                       CREEP COUNTS



// ------------------------------------------------ CREEP SPAWNING LOGIC ------------------------------------------------

module.exports.loop = function () {
    if (!Game.spawns['Spawn1']) { return; }
    let spawn = Game.spawns['Spawn1'];
    ClearUnusedMemory();
    ClearMemoryOfStorage(spawn.room);
    spawn.memory.beingUsed = false;

    var level = GetMyLevel();
    var creepCounts = GetCreepsCountForLevel(level);

    // console.log(JSON.stringify(creepCounts));


    const requiredAmountOfBuilders = creepCounts.builders;
    const requiredAmountOfUpgraders = creepCounts.upgraders;
    const requiredAmountOfHarvesters = creepCounts.harvesters;
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
    var notSpawingReason = "None";


    if (!spawn.spawning && !DEBUG) {

        //if there is not a single upgrader, build one, else work with normal logic
        if (currentUpgraders.length == 0) {
            var parts = GetUpgraderBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            var res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'U');
            if (res == OK) {
                console.log("Spawned upgrader because there was none");
            } else {
                useLowResorceMode = true;
                notSpawingReason = GetStringFromErrorCode(res);
            }
        }

        if ((currentHarvesters.length < requiredAmountOfHarvesters) && !useLowResorceMode) {
            useLowResorceMode = true;
            var parts = GetHarvesterBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            resorceResion = "Spawn Harvester";
            res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'H');
            resorceGoal = spawner.GetCreepCost(parts.works, parts.carries, parts.moves);
            notSpawingReason = GetStringFromErrorCode(res);
        }

        if (currentUpgraders.length < requiredAmountOfUpgraders && !useLowResorceMode) {
            var res = undefined;
            useLowResorceMode = true;
            resorceResion = "Spawn Upgrader";
            var parts = GetUpgraderBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'U');
            resorceGoal = spawner.GetCreepCost(parts.works, parts.carries, parts.moves);
            notSpawingReason = GetStringFromErrorCode(res);
        }

        if (currentBuilders.length < requiredAmountOfBuilders && !useLowResorceMode) {
            useLowResorceMode = true;
            resorceResion = "Spawn Builder";
            var parts = GetBuilderBodyPartsCounts(GetMyLevel());
            if (parts == undefined) { console.log("ERROR PARTS"); return; }
            res = spawner.SpawnNewCreep(spawn, parts.works, parts.carries, parts.moves, 'B');
            resorceGoal = spawner.GetCreepCost(parts.works, parts.carries, parts.moves);
            notSpawingReason = GetStringFromErrorCode(res);
        }

        if (res != undefined) {
            // console.log("Error spawing " + GetStringFromErrorCode(res));

        }

    }

    var buildJobCount = spawn.room.find(FIND_CONSTRUCTION_SITES).length;


    var tower = Game.getObjectById('64190d2f505b0179fa1f02ec');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
                structure.hits < structure.hitsMax &&
                structure.structureType != STRUCTURE_WALL
                ||
                structure.structureType == STRUCTURE_WALL && structure.hits < 10000

        });


        if (closestDamagedStructure) {

            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }


    var creeps = Game.creeps;
    for (var name in creeps) {
        var creep = creeps[name];

        switch (creep.memory.group) {
            case 'H':
                harversterLogic.run(creep, spawn, useLowResorceMode);
                break;
            case 'B':
                if (useLowResorceMode) {
                    harversterLogic.run(creep, spawn);
                    break;
                }
                builderLogic.run(creep, spawn, useLowResorceMode);

                if (buildJobCount == 0) {
                    upgraderLogic.run(creep, spawn, useLowResorceMode);
                }

                break;
            case 'U':
                upgraderLogic.run(creep, spawn, useLowResorceMode);
                break;

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

        var spawningErrorColor = notSpawingReason == "None" ? goodColor : badColor;
        var lowResorceColor = useLowResorceMode ? energyColor : goodColor;

        var row = 10;
        var col = 10;
        var harvesterString = "Harvesters: " + currentHarvesters.length + "/" + requiredAmountOfHarvesters;
        var visualName = Room.name;
        new RoomVisual(visualName).text("----LEVEL----", col, row++, { color: 'green', font: 0.8 });
        new RoomVisual(visualName).text("Level: " + GetMyLevel(), col, row++, { color: 'green', font: 0.8 });
        new RoomVisual(visualName).text("----STATUS----", col, row++, { color: 'green', font: 0.8 });
        new RoomVisual(visualName).text(updateString, col, row++, { color: 'green', font: 0.8 });
        new RoomVisual(visualName).text(harvesterString, col, row++, { color: harvesterColor, font: 0.8 });
        new RoomVisual(visualName).text("Builders: " + currentBuilders.length + "/" + requiredAmountOfBuilders, col, row++, { color: builderColor, font: 0.8 });
        new RoomVisual(visualName).text("Upgraders: " + currentUpgraders.length + "/" + requiredAmountOfUpgraders, col, row++, { color: upgraderColor, font: 0.8 });
        new RoomVisual(visualName).text("Build Jobs: " + buildJobCount, col, row++, { color: builderColor, font: 0.8 });
        new RoomVisual(visualName).text(totalEnergy, col, row++, { color: energyColor, font: 0.8 });
        new RoomVisual(visualName).text("----SPAWNING----", col, row++, { color: 'green', font: 0.8 });

        new RoomVisual(visualName).text('Error: ' + notSpawingReason, col, row++, { color: spawningErrorColor, font: 0.8 });


        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            new RoomVisual('').text('Spawning: ' + spawningCreep.memory.group, 10, row++, { color: 'green', font: 0.8 });
        } else {
            new RoomVisual('').text('Spawning: None', 10, row++, { color: 'green', font: 0.8 });
        }

        new RoomVisual('').text("---RESOURCE INFO---", 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("Low Resorce Mode: " + useLowResorceMode, 10, row++, { color: lowResorceColor, font: 0.8 });
        new RoomVisual('').text("Resorce Goal: " + resorceGoal, 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("Resorce Resion: " + resorceResion, 10, row++, { color: 'green', font: 0.8 });

        new RoomVisual('').text("---REQUIRED CREEP AMOUNTS---", 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("REQ STR " + JSON.stringify(creepCounts), 10, row++, { color: 'green', font: 0.8 });
        new RoomVisual('').text("CUR STR " + JSON.stringify(GetHarvesterBodyPartsCounts(GetMyLevel())), 10, row++, { color: 'green', font: 0.8 });
        //print creep group and name for debugging
        new RoomVisual('').text("---Creeps---", 10, row++, { color: 'green', font: 0.8 });
        for (var name in creeps) {
            var creep = creeps[name];
            new RoomVisual('').text(creep.memory.group + ": " + creep.name, 10, row++, { color: 'green', font: 0.8 });
        }

    }

}