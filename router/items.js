"use strict";

var util  = require("util"),
    axios = require("axios"),
    
    $ref  = require("falcor").Model.ref;

module.exports = [ {
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
                
                return axios.get(
                    util.format("https://api.guildwars2.com/v2/items?page=%d&page_size=%d", page, size + diff)
                )
                .then(function(resp) {
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
                                value : $ref("itemsById." + item.id)
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
} ];
