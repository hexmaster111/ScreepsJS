var harvesterLogic = require('harvesterLogic');
var buidlerLogic = {
    run: function (creep, spawn, useLowResorceMode) {


        if (useLowResorceMode) {
            harvesterLogic.run(creep, spawn);
            return;
        }



        // Get Energy from spawn
        // If the creep is empty, it will go to the spawn and get energy
        // If the creep is full, it will go to the closest construction site and build it
        // If there is no construction site, it will go to the controller and upgrade it
        if (creep.memory.building == undefined) {
            creep.memory.building = true;
        }

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }

        if (!creep.memory.building) {
            var spawnOrExtension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (spawnOrExtension != undefined) {
                if (creep.withdraw(spawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnOrExtension, { visualizePathStyle: { stroke: '#ffaa00' } });
                    return;
                }
                return;
            }

            if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffaa00' } });
                return;
            }


            console.log("Creep: " + creep.name + " is building: " + creep.memory.building +
                " and has energy: " + creep.store[RESOURCE_ENERGY] + " and has free capacity: " +
                creep.store.getFreeCapacity());
        }

        if (creep.memory.building) {

            //if there is a flag labeled "BUILDFAST" then build that first
            var buildFastFlag = Game.flags["BUILDFAST"];
            if (buildFastFlag != undefined) {
                var buildFastSite = buildFastFlag.pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (buildFastSite != undefined && buildFastSite.length > 0) {
                    if (creep.build(buildFastSite[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(buildFastSite[0], { visualizePathStyle: { stroke: '#FF0000FF' } });
                    }
                    return;
                }
            }

            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                harvesterLogic.run(creep, spawn);
            }
        }

    }
}

module.exports = buidlerLogic;