"use strict";

var Model  = require("falcor").Model,
    $ref   = Model.ref,
    $atom  = Model.atom,
    $error = Model.atom,
    
    http   = require("../lib/http"),
    map    = require("./lib/map-ids"),
    fields = require("./lib/fields");

module.exports = [ {
    route : "colors.length",
    get   : function(pathset) {
        return http.json("https://api.guildwars2.com/v2/colors")
            .then(function(json) {
                return {
                    path  : pathset,
                    value : $atom(json.length)
                };
            });
    }
}, {
    route : "colors[{integers:ids}]",
    get   : function(pathSet) {
        // TODO: figure out if there's a more efficient way to get this data
        return http.json("https://api.guildwars2.com/v2/colors")
        .then(function(json) {
            return pathSet.ids.map(function(id) {
                return {
                    path  : [ pathSet[0], id ],
                    value : json[id] ?
                        $ref([ "colorsById", json[id] ]) :
                        $error("Invalid index")
                };
            });
        });
    }
} ];
