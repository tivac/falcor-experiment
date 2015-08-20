"use strict";

var axios = require("axios");

module.exports = require("falcor-router").createClass([ {
    route : "items.length",
    get   : function(pathSet) {
        return axios.get("https://api.guildwars2.com/v2/items")
            .then(function(resp) {
                return {
                    path  : pathSet,
                    value : resp.data.length
                };
            });
    }
}, {
    route : "items[{ranges:ids}]",
    get   : function(pathSet) {
        // TODO: needs to support multiple ranges!
        var size = Math.max(1, pathSet.ids[0].to - pathSet.ids[0].from),
            page = Math.floor(pathSet.ids[0].from / size);
        
        return axios.get("https://api.guildwars2.com/v2/items?page=" + page + "&page_size=" + size)
            .then(function(resp) {
                return resp.data
                    .sort(function(a, b) {
                        return a.id - b.id;
                    })
                    .map(function(item, idx) {
                        return {
                            path  : [ "items", idx ],
                            value : {
                                $type : "ref",
                                value : [ "itemsById", item.id ]
                            }
                        };
                    });
            });
    }
}, {
    route : "itemsById[{integers:ids}]['id', 'name', 'type', 'level', 'rarity', 'icon']",
    get   : function(pathSet) {
        return axios.get("https://api.guildwars2.com/v2/items?ids=" + pathSet.ids.join(","))
            .then(function(resp) {
                var map     = {},
                    results = [];
                
                resp.data.forEach(function(item) {
                    map[item.id] = item;
                });
                
                pathSet.ids.forEach(function(id) {
                    pathSet[2].forEach(function(key) {
                        if(!map[id]) {
                            return results.push({
                                path  : [ pathSet[0], id, key ],
                                value : {
                                    $type : "error",
                                    value : "Unknown item"
                                }
                            });
                        }
                        
                        if(!map[id][key]) {
                            return results.push({
                                path  : [ pathSet[0], id, key ],
                                value : {
                                    $type : "error",
                                    value : "Unknown field"
                                }
                            });
                        }
                        
                        results.push({
                            path  : [ pathSet[0], id, key ],
                            value : map[id][key]
                        });
                    });
                });
                
                return results;
            });
    }
}, {
    route : "itemsById[{integers:ids}]['buys', 'sells']['price', 'quantity']",
    get   : function(pathSet) {
        return axios.get("https://api.guildwars2.com/v2/commerce/prices?ids=" + pathSet.ids.join(","))
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
} ]);
