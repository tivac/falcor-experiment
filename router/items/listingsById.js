"use strict";

var $error = require("falcor").Model.error,
    $atom  = require("falcor").Model.atom,
    
    http   = require("../../lib/http"),
    map    = require("../lib/map-ids"),
    fields = require("../lib/fields");

module.exports = [ {
    route : "listingsById[{integers:ids}]['buys', 'sells'].length",
    get   : function(pathset) {
        return http.json("https://api.guildwars2.com/v2/commerce/listings?ids=" + pathset.ids.join(","))
        .then(map)
        .then(function(map) {
            var paths = [];
            
            pathset.ids.forEach(function(id) {
                pathset[2].forEach(function(type) {
                    var path = [ pathset[0], id, type, pathset[3] ];
                    
                    if(!map[id]) {
                        return paths.push({
                            path  : path,
                            value : $error("Unknown item")
                        });
                    }
                    
                    paths.push({
                        path  : path,
                        value : $atom(map[id][type].length)
                    });
                });
            });
            
            return paths;
        });
    }
}, {
    route : "listingsById[{integers:ids}]['buys', 'sells'][{integers:indices}][{keys:fields}]",
    get   : function(pathset) {
        return http.json("https://api.guildwars2.com/v2/commerce/listings?ids=" + pathset.ids.join(","))
        .then(map)
        .then(function(map) {
            var paths = [];
            
            pathset.ids.forEach(function(id) {
                pathset[2].forEach(function(type) {
                    if(!map[id]) {
                        return paths.push({
                            path  : [ pathset[0], id, type ],
                            value : $error("Unknown item")
                        });
                    }
                    
                    pathset.indices.forEach(function(index) {
                        if(!map[id][type][index]) {
                            return paths.push({
                                path  : [ pathset[0], id, type, index ],
                                value : $error("Unknown listing index")
                            });
                        }
    
                        fields(paths, pathset.fields, [ pathset[0], id, type, index ], map[id][type][index]);
                    });
                });
            });
            
            return paths;
        });
    }
} ];
