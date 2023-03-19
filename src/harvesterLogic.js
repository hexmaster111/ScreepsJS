

const MAX_PER_UNFLAGED_SOURCE = 2;


//A source is open if it has less than 2 creeps assigned to it OR 
// if it has a flag on it that says a number of creeps can be assigned to it
// ignore the source if it has a flag on it that says NOGO
function findOpenSource(creep) {
    var ret = undefined;
    var sources = creep.room.find(FIND_SOURCES);
    var sourceHasFlag = false;
    var sourceFlag = undefined;
    var sourceFlagText = undefined;

    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        var sourceFlag = source.pos.lookFor(LOOK_FLAGS);
        if (sourceFlag != undefined && sourceFlag.length > 0) {
            sourceFlag = sourceFlag[0];
            sourceHasFlag = true;
        }

        if (sourceHasFlag) {
            sourceFlagText = sourceFlag.name;
            if (sourceFlagText == "NOGO") {
                //ignore this source
                continue;
            }
        }

        //the sources memory is keeping track of how many creeps are assigned to it
        if (source.memory == undefined) {
            source.memory = {};
        }
        if (source.memory.creepCount == undefined) {
            source.memory.creepCount = 0;
        }

        if (sourceHasFlag) {
            var sourceFlagNumber = parseInt(sourceFlagText);
            if (sourceFlagNumber != NaN) {
                if (source.memory.creepCount < sourceFlagNumber) {
                    ret = source;
                    break;
                }
            }
        } else {
            if (source.memory.creepCount < MAX_PER_UNFLAGED_SOURCE) {
                ret = source;
                break;
            }
        }
    }

    if (ret != undefined) {
        new RoomVisual(creep.room.name).text(
            creep.name,
            ret.pos.x,
            ret.pos.y + ret.memory.creepCount,
            { align: 'center', opacity: 0.8, font: 0.3, color: 'red' });


        ret.memory.creepCount++;
    }
    return ret;
}






//harverster module
var harvesterLogic = {
    run: function (creep, spawn) {
        // Gets energy from the closest source
        // If the creep is full, it will go to the spawn and transfer the energy
        // If the creep is empty, it will go to the closest source and get energy

        var isFull = creep.store.getFreeCapacity() == 0;
        var isEmpty = creep.store.getUsedCapacity() == 0;
        var isFilling = creep.memory.isFilling;

        var source = undefined;
        source = findOpenSource(creep);



        var dest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (dest == undefined) {
            dest = spawn;
        }

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
            if (creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dest, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

        if (isFull) {
            if (creep.transfer(dest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dest, { visualizePathStyle: { stroke: '#ffffff' } });
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