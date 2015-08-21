"use strict";

var axios = require("axios");

module.exports = [ {
    route : "itemsById[{integers:ids}].details[{keys:fields}]",
    get   : function(pathSet) {
        return axios.get(
            "https://api.guildwars2.com/v2/items?ids=" + pathSet.ids.join(",")
        )
        .then(function(resp) {
            var map     = {},
                results = [];
            
            resp.data.forEach(function(item) {
                map[item.id] = item;
            });
            
            pathSet.ids.forEach(function(id) {
                if(!map[id]) {
                    return results.push({
                        path  : [ pathSet[0], id ],
                        value : {
                            $type : "error",
                            value : "Unknown item"
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
                    
                    results.push({
                        path  : path,
                        value : map[id][field]
                    });
                });
            });
            
            return results;
        });
    }
}, {
    route : "itemsById[{integers:ids}]['buys', 'sells']['price', 'quantity']",
    get   : function(pathSet) {
        return axios.get(
            "https://api.guildwars2.com/v2/commerce/prices?ids=" + pathSet.ids.join(",")
        )
        .then(function(resp) {
            var map     = {},
                results = [];
            
            resp.data.forEach(function(item) {
                map[item.id] = item;
            });
            
            pathSet.ids.forEach(function(id) {
                pathSet[2].forEach(function(type) {
                    pathSet[3].forEach(function(field) {
                        if(!map[id]) {
                            return results.push({
                                path  : [ pathSet[0], id, type, field ],
                                value : {
                                    $type : "error",
                                    value : "Unknown item"
                                }
                            });
                        }
                        
                        results.push({
                            path  : [ pathSet[0], id, type, field ],
                            value : map[id][type][field === "price" ? "unit_price" : field]
                        });
                    });
                });
            });
            
            return results;
        });
    }
} ];
