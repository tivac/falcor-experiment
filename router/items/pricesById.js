"use strict";

var $error = require("falcor").Model.error,
    $atom  = require("falcor").Model.atom,
    
    chunk  = require("../lib/chunk"),
    map    = require("../lib/map-ids"),
    fields = require("../lib/fields");

module.exports = [ {
    route : "pricesById[{integers:ids}]['buys', 'sells'][{keys:fields}]",
    get   : function(pathSet) {
        return chunk("https://api.guildwars2.com/v2/commerce/prices?ids=", pathSet.ids)
        .then(map)
        .then(function(map) {
            var paths = [];
            
            pathSet.ids.forEach(function(id) {
                pathSet[2].forEach(function(type) {
                    if(!map[id]) {
                        return;
                    }
                    
                    fields(paths, pathSet.fields, [ pathSet[0], id, type ], map[id][type]);
                });
            });
            
            return paths;
        });
    }
} ];
