"use strict";

module.exports = function idMap(data) {
    var map = {};
    
    data.forEach(function(thing) {
        map[thing.id] = thing;
    });
    
    return map;
};
