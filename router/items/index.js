"use strict";

var Model  = require("falcor").Model,
    $ref   = Model.ref,
    $error = Model.error,
    $atom  = Model.atom,
    
    http = require("../../lib/http");

module.exports = [ {
    route : "items.length",
    get   : function(pathSet) {
        return http("https://api.guildwars2.com/v2/items?page=0&page_size=1").then(function(response) {
            return {
                path  : pathSet,
                value : $atom(
                    parseInt(response.headers.get("X-Result-Total"), 10)
                )
            };
        });
    }
}, {
    route : "items[{integers:ids}]",
    get   : function(pathSet) {
        // TODO: figure out if there's a more efficient way to get this data
        return http.json("https://api.guildwars2.com/v2/items")
        .then(function(json) {
            return pathSet.ids.map(function(id) {
                return {
                    path  : [ pathSet[0], id ],
                    value : json[id] ?
                        $ref([ "itemsById", json[id] ]) :
                        $error("Invalid index")
                };
            });
        });
    }
} ];
