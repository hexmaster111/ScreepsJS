//harverster module
var harvesterLogic = {
    run: function (creep, spawn) {
        // Gets energy from the closest source
        // If the creep is full, it will go to the spawn and transfer the energy
        // If the creep is empty, it will go to the closest source and get energy

        var isFull = creep.store.getFreeCapacity() == 0;
        var isEmpty = creep.store.getUsedCapacity() == 0;
        var isFilling = creep.memory.isFilling;
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (isFilling == undefined) {
            creep.memory.isFilling = true;
            isFilling = true;
        }
        // console.log("[DEBUG HARVISTER] isFilling: " + isFilling + " isFull: " + isFull + " isEmpty: " + isEmpty);

        if (isFilling && isFull) {
            creep.memory.isFilling = false;
            creep.say("Transfering");
        }

        if (!isFilling && isEmpty) {
            creep.memory.isFilling = true;
            creep.say("Harvesting");
        }

        if (!isFilling) {
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        if (isFull) {
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        if (isFilling) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                var move = creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                if (move == ERR_NO_PATH) {
                    creep.say("No Path");
                }
            }
        }



    }
};
module.exports = harvesterLogic;