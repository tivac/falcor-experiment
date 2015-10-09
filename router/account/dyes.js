"use strict";

var Model = require("falcor").Model,
    $ref  = Model.ref,
    $atom = Model.atom,
    
    http = require("../../lib/http"),
    auth = require("./lib/auth");

module.exports = [ {
    route : "account.dyes.length",
    get   : auth(function(key, pathset) {
        return http.json("https://api.guildwars2.com/v2/account/dyes?access_token=" + key).then(function(resp) {
            return {
                path  : pathset,
                value : $atom(resp.length)
            };
        });
    })
}, {
    route : "account.dyes[{integers:indices}]",
    get   : auth(function(key, pathset) {
        return http.json("https://api.guildwars2.com/v2/account/dyes?access_token=" + key).then(function(resp) {
            return pathset.indices.map(function(index) {
                return {
                    path  : [ pathset[0], pathset[1], index ],
                    value : resp[index] ? $ref([ "colorsById", resp[index] ]) : $error("Unknown dye index")
                };
            });
        });
    })
} ];
