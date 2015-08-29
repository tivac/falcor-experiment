"use strict";

var util  = require("util"),
    axios = require("axios"),
    
    $ref  = require("falcor").Model.ref;

// TODO: This is almost an exact copy of items.js!
module.exports = [ {
    route : "colors.length",
    get   : function(pathSet) {
        return axios.get("https://api.guildwars2.com/v2/colors")
            .then(function(resp) {
                return {
                    path  : pathSet,
                    value : resp.data.length
                };
            });
    }
}, {
    route : "colors[{ranges:ids}]",
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
                    util.format("https://api.guildwars2.com/v2/colors?page=%d&page_size=%d", page, size + diff)
                )
                .then(function(resp) {
                    return resp.data
                        .sort(function(a, b) {
                            return a.id - b.id;
                        })
                        .filter(function(color, idx) {
                            return start + idx >= range.from;
                        })
                        .map(function(color, idx) {
                            return {
                                path  : [ "colors", range.from + idx ],
                                value : $ref([ "colorsById", color.id ])
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
