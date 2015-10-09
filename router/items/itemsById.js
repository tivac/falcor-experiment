"use strict";

var Model  = require("falcor").Model,
    $error = Model.error,
    $atom  = Model.atom,
    $ref   = Model.ref,

    chunk  = require("../lib/chunk"),
    map    = require("../lib/map-ids"),
    fields = require("../lib/fields");

function refs(base) {
    return function(pathset) {
        var paths = pathset.ids.map(function(id) {
            return {
                path  : [ pathset[0], id, pathset[2] ],
                value : $ref(base.concat(id))
            };
        });
        
        return paths;
    }
}

module.exports = [ {
    route : "itemsById[{integers:ids}].id",
    get   : function(pathset) {
        return pathset.ids.map(function(id) {
            return {
                path  : [ pathset[0], id, pathset[2] ],
                value : $atom(id)
            };
        });
    },
}, {
    route : "itemsById[{integers:ids}][{keys:fields}]",
    get   : function(pathset) {
        return chunk("https://api.guildwars2.com/v2/items?ids=", pathset.ids)
        .then(map)
        .then(function(map) {
            var paths = [];
            
            pathset.ids.forEach(function(id) {
                fields(paths, pathset.fields, [ pathset[0], id ], map[id]);
            });
            
            return paths;
        });
    }
}, {
    route : "itemsById[{integers:ids}].prices",
    get   : refs([ "pricesById" ])
}, {
    route : "itemsById[{integers:ids}].listings",
    get   : refs([ "listingsById" ])
} ];
