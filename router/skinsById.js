"use strict";

var axios  = require("axios"),
    falcor = require("falcor"),
    
    $error = falcor.Model.error,
    
    mapIds = require("./lib/map-ids");

module.exports = [ {
    route : "skinsById[{integers:ids}][{keys:fields}]",
    get   : function(pathSet) {
        return axios.get(
            "https://api.guildwars2.com/v2/skins?ids=" + pathSet.ids.join(",")
        )
        .then(mapIds)
        .then(function(map) {
            var results = [];
            
            pathSet.ids.forEach(function(id) {
                if(!map[id]) {
                    return results.push({
                        path  : [ pathSet[0], id ],
                        value : $error("Unknown recipe")
                    });
                }
                
                pathSet.fields.forEach(function(field) {
                    var path = [ pathSet[0], id, field ];
                    
                    if(!map[id][field]) {
                        return results.push({
                            path  : path,
                            value : $error("Unknown field")
                        });
                    }
                    
                    results.push({
                        path  : path,
                        value : map[id][field]
                    });
                });
            });
            
            return results;
        });
    }
} ];
