"use strict";

var axios = require("axios"),
    
    $ref = require("falcor").Model.ref,
    
    auth = require("./lib/auth");

module.exports = [ {
    route : "account.skins.length",
    get   : auth(function(pathSet, key) {
        return axios.get("https://api.guildwars2.com/v2/account/skins?access_token=" + key)
            .then(function(resp) {
                console.log(resp.data);
                
                return {
                    path  : pathSet,
                    value : resp.data.length
                };
            });
    })
}, {
    route : "account.skins[{ranges:ids}]",
    get   : auth(function(pathSet, key) {
        return axios.get("https://api.guildwars2.com/v2/account/skins?access_token=" + key)
            .then(function(resp) {
                var results = [];
                
                pathSet.ids.forEach(function(range) {
                    resp.data.slice(range.from, range.to + 1).forEach(function(dye, idx) {
                        results.push({
                            path  : [ pathSet[0], pathSet[1], range.from + idx ],
                            value : $ref([ "skinsById", dye ])
                        });
                    });
                });
                
                return results;
            });
    })
} ];
