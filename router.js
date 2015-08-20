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
        // Using axios all because we may have been passed multiple ranges
        return axios.all(
            pathSet.ids.map(function(range) {
                var size = Math.max(1, range.to - range.from),
                    page = Math.floor(range.from / size);
                
                return axios.get("https://api.guildwars2.com/v2/items?page=" + page + "&page_size=" + size)
                    .then(function(resp) {
                        return resp.data
                            .sort(function(a, b) {
                                return a.id - b.id;
                            })
                            .map(function(item, idx) {
                                return {
                                    path  : [ "items", range.from + idx ],
                                    value : {
                                        $type : "ref",
                                        value : [ "itemsById", item.id ]
                                    }
                                };
                            });
                    });
            })
        )
        .then(function(ranges) {
            var paths = [];
            
            ranges.forEach(function(range) {
                paths = paths.concat(range);
            });
            
            return paths;
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
