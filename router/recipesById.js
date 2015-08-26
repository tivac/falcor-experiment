"use strict";

var axios = require("axios");

module.exports = [ {
    route : "recipesById[{integers:ids}].details[{keys:fields}]",
    get   : function(pathSet) {
        return axios.get(
            "https://api.guildwars2.com/v2/recipes?ids=" + pathSet.ids.join(",")
        )
        .then(function(resp) {
            var map     = {},
                results = [];
            
            resp.data.forEach(function(recipe) {
                map[recipe.id] = recipe;
            });
            
            pathSet.ids.forEach(function(id) {
                if(!map[id]) {
                    return results.push({
                        path  : [ pathSet[0], id ],
                        value : {
                            $type : "error",
                            value : "Unknown recipe"
                        }
                    });
                }
                
                pathSet.fields.forEach(function(field) {
                    var path = [ pathSet[0], id, pathSet[2], field ];
                    
                    if(!map[id][field]) {
                        return results.push({
                            path  : path,
                            value : {
                                $type : "error",
                                value : "Unknown field"
                            }
                        });
                    }
                    
                    if(field === "ingredients") {
                        return map[id].ingredients.forEach(function(ingredient, idx) {
                            results.push({
                                path  : path.concat(idx, "item"),
                                value : {
                                    $type : "ref",
                                    value : [ "itemsById", ingredient.item_id ]
                                }
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
