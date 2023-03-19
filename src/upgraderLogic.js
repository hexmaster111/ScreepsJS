var Harvester = require('harvesterLogic');
var finder = require('finder');


var upgraderLogic = {
    run: function (creep, spawn) {
        // Get Energy from spawn
        // If the creep is full, it will go to the controller and upgrade it
        // If the creep is empty, it will go to the spawn and get energy
        if (creep.memory.upgrading == undefined) {
            creep.memory.upgrading = false;
        }

        // console.log("Upgrader: " + creep.memory.upgrading + " " + creep.store[RESOURCE_ENERGY] + "/" + creep.store.getFreeCapacity());
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }


        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: 'red' } });
            }
        }

        if (!creep.memory.upgrading) {

            var spawnOrExtension = finder.findEnergySource(creep);
            if (spawnOrExtension == undefined) {

            }

            if (creep.withdraw(spawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawnOrExtension, { visualizePathStyle: { stroke: 'red' } });
            }
        }


    }
}

module.exports = upgraderLogic;