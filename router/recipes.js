"use strict";

var util  = require("util"),
    axios = require("axios");

module.exports = [ {
    route : "recipes['input', 'output'][{integers:ids}].length",
    get   : function(pathSet) {
        return axios.all(
            pathSet.ids.map(function(id) {
                return axios.get(
                    util.format("https://api.guildwars2.com/v2/recipes/search?%s=%d", pathSet[1], id)
                )
                .then(function(resp) {
                    return {
                        path  : [ pathSet[0], pathSet[1], id, pathSet[3] ],
                        value : resp.data.length
                    };
                });
            })
        );
    }
}, {
    route : "recipes['input', 'output'][{integers:ids}][{ranges:ranges}]",
    get   : function(pathSet) {
        return axios.all(
            pathSet.ids.map(function(id) {
                return axios.get(
                    util.format("https://api.guildwars2.com/v2/recipes/search?%s=%d", pathSet[1], id)
                )
                .then(function(resp) {
                    var paths = [];
                    
                    pathSet.ranges.forEach(function(range) {
                        var x, value;
                        
                        for(x = range.from; x <= range.to; x++) {
                            value = resp.data[x];
                            
                            paths.push({
                                path  : [ pathSet[0], pathSet[1], id, x ],
                                value : value ? {
                                    $type : "ref",
                                    value : [ "recipesById", value ]
                                } : {
                                    $type : "error",
                                    value : "Invalid"
                                }
                            });
                        }
                    });
                    
                    return paths;
                });
            })
        )
        .then(function(results) {
            return [].concat.apply([], results);
        });
    }
} ];
