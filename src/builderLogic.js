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
            if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }

        if (creep.memory.building) {
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