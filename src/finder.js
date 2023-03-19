function findClosestEnergySource(creep, nextCount, ammountRequired) {
    if (nextCount == undefined) {
        nextCount = 0;
    }

    var allSourcesSortedByDistance = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                (structure.structureType == STRUCTURE_SPAWN &&
                    structure.store[RESOURCE_ENERGY] >= ammountRequired)) ||
                (structure.structureType == STRUCTURE_EXTENSION &&
                    structure.store[RESOURCE_ENERGY] >= ammountRequired);
        }
    }).sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));

    if (allSourcesSortedByDistance.length > nextCount) {
        return allSourcesSortedByDistance[nextCount];
    }
    else {
        return undefined;
    }
}

function findEnergySource(creep, nextCount, ammountRequired) {
    var fullestSpawnOrExtension = findClosestEnergySource(creep, nextCount, ammountRequired);
    if (fullestSpawnOrExtension != undefined) {
        if (fullestSpawnOrExtension.memory == undefined) {
            fullestSpawnOrExtension.memory = {};
        }
        if (fullestSpawnOrExtension.memory.beingUsed == undefined) {
            fullestSpawnOrExtension.memory.beingUsed = 0;
        }
        if (fullestSpawnOrExtension.memory.beingUsed < 1) {
            fullestSpawnOrExtension.memory.beingUsed++;
            return fullestSpawnOrExtension;
        }
        else {
            if (nextCount == undefined) {
                nextCount = 0;
            }

            if (nextCount > 10) {
                return undefined;
            }
            return findEnergySource(creep, nextCount + 1, ammountRequired);
        }
    }
    else {
        return undefined;
    }
}




function visualizeSelectedSource(creep, source, usageCount) {
    if (source != undefined) {
        new RoomVisual(creep.room.name).text(
            creep.name,
            source.pos.x + usageCount,
            source.pos.y,
            { align: 'center', opacity: 0.8, font: 0.3, color: 'red' });

    }
}




var finder = {
    findEnergySource: function (creep, ammountRequired) {
        if (ammountRequired == undefined) {
            ammountRequired = 49;
        }

        var fullestSpawnOrExtension = findEnergySource(creep, 0, ammountRequired);
        if (fullestSpawnOrExtension != undefined) {
            if (fullestSpawnOrExtension.memory == undefined) {
                fullestSpawnOrExtension.memory = {};
            }
            if (fullestSpawnOrExtension.memory.beingUsed == undefined) {
                fullestSpawnOrExtension.memory.beingUsed = 0;
            }

            visualizeSelectedSource(creep, fullestSpawnOrExtension, fullestSpawnOrExtension.memory.beingUsed);

            return fullestSpawnOrExtension;
        }
        return undefined;
    },
    findFreeSource: function (creep) {

    }
}


module.exports = finder;