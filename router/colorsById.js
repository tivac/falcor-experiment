"use strict";

var Model  = require("falcor").Model,
    $error = Model.error,
    $atom  = Model.atom,
    $ref   = Model.ref,
    
    chunk  = require("./lib/chunk"),
    map    = require("./lib/map-ids"),
    fields = require("./lib/fields");

module.exports = [ {
    route : "colorsById[{integers:ids}].id",
    get   : function(pathset) {
        return pathset.ids.map(function(id) {
            return {
                path  : [ pathset[0], id, pathset[2] ],
                value : $atom(id)
            };
        });
    },
}, {
    route : "colorsById[{integers:ids}].item",
    get   : function(pathset) {
        return chunk("https://api.guildwars2.com/v2/colors?ids=", pathset.ids)
        .then(map)
        .then(function(map) {
            return pathset.ids.map(function(id) {
                if(!map[id]) {
                    return {
                        path  : [ pathset[0], id ],
                        value : $error("Unknown color")
                    };
                }
                
                return {
                    path  : [ pathset[0], id, pathset[2] ],
                    value : $ref([ "itemsById", map[id].item ])
                };
            });
        });
    }
}, {
    route : "colorsById[{integers:ids}][{keys:fields}]",
    get   : function(pathset) {
        return chunk("https://api.guildwars2.com/v2/colors?ids=", pathset.ids)
        .then(map)
        .then(function(map) {
            var paths = [];
            
            pathset.ids.forEach(function(id) {
                if(!map[id]) {
                    return paths.push({
                        path  : [ pathset[0], id ],
                        value : $error("Unknown color")
                    });
                }
                
                fields(paths, pathset.fields, [ pathset[0], id ], map[id]);
            });
            
            return paths;
        });
    }
} ];
