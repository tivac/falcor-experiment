"use strict";

var axios = require("axios"),
    
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
        return axios.get("https://api.guildwars2.com/v2/items")
            .then(function(resp) {
                var results = [];
                
                pathSet.ids.forEach(function(range) {
                    resp.data.slice(range.from, range.to + 1).forEach(function(id, idx) {
                        results.push({
                            path  : [ pathSet[0], range.from + idx ],
                            value : $ref([ "itemsById", id ])
                        });
                    });
                });
                
                return results;
            });
    }
} ];
