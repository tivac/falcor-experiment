"use strict";

var axios  = require("axios"),
    falcor = require("falcor"),
    
    $ref   = falcor.Model.ref,
    $error = falcor.Model.error,
    
    mapIds = require("./lib/map-ids");

module.exports = [ {
    route : "recipesById[{integers:ids}].details[{keys:fields}]",
    get   : function(pathSet) {
        return axios.get(
            "https://api.guildwars2.com/v2/recipes?ids=" + pathSet.ids.join(",")
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
                    var path = [ pathSet[0], id, pathSet[2], field ];
                    
                    if(!map[id][field]) {
                        return results.push({
                            path  : path,
                            value : $error("Unknown field")
                        });
                    }
                    
                    if(field === "ingredients") {
                        return map[id].ingredients.forEach(function(ingredient, idx) {
                            results.push({
                                path  : path.concat(idx, "item"),
                                value : $ref([ "itemsById", ingredient.item_id ])
                            }, {
                                path  : path.concat(idx, "count"),
                                value : ingredient.count
                            });
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
