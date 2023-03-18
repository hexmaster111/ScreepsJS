var upgraderLogic = {
    run: function (creep, spawn, useLowResorceMode) {
        // Get Energy from spawn
        // If the creep is full, it will go to the controller and upgrade it
        // If the creep is empty, it will go to the spawn and get energy
        if (creep.memory.upgrading == undefined) {
            creep.memory.upgrading = false;
        }

        if (useLowResorceMode) {
            return;
        }

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
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        if (!creep.memory.upgrading) {
            if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }


    }
}

module.exports = upgraderLogic;