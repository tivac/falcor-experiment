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
                // Adding one to size because ranges are inclusive
                var size  = (range.to + 1) - range.from,
                    page  = Math.floor(range.from / size),
                    // Determine starting index so we can filter out results
                    start = size * page,
                    // Sometimes page starts won't line up nicely
                    diff  = range.from - start;
                
                console.log("https://api.guildwars2.com/v2/items?page=" + page + "&page_size=" + (size + diff));
                
                return axios.get(
                    "https://api.guildwars2.com/v2/items?page=" + page + "&page_size=" + (size + diff)
                ).then(function(resp) {
                    return resp.data
                        .sort(function(a, b) {
                            return a.id - b.id;
                        })
                        .filter(function(item, idx) {
                            return start + idx >= range.from;
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
} ]);
