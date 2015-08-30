"use strict";

module.exports = function idMap(resp) {
    var map = {};
    
    resp.data.forEach(function(thing) {
        map[thing.id] = thing;
    });
    
    return map;
};
