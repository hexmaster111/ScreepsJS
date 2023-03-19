var harvesterLogic = require('harvesterLogic');
var finder = require('finder');
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









var buidlerLogic = {
    run: function (creep, spawn) {
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
            var source = finder.findEnergySource(creep);
            if (source != undefined) {
                if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#FF0000FF' } });
                }
            }
            else {
                // console.log("Builder " + creep.name + " is out of energy and can't find a spawn or extension");
                // console.log("Builder " + creep.name + " is going to harvest");
                harvesterLogic.run(creep, spawn);
            }
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