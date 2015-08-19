"use strict";

var axios = require("axios");

module.exports = require("falcor-router").createClass([ {
    route : "items",
    get   : function(pathSet) {
        console.log(pathSet);
        
        return axios.get("https://api.guildwars2.com/v2/items")
            .then(function(resp) {
                return resp.data.map(function(id, idx) {
                    return {
                        path  : [ pathSet[0], idx ],
                        value : id
                    };
                });
            });
    }
}, {
    route : "items[{integers:ids}]['name', 'type', 'level', 'rarity', 'icon']",
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
                                path  : [ "items", id, key ],
                                value : {
                                    $type : "error",
                                    value : "Unknown item"
                                }
                            });
                        }
                        
                        if(!map[id][key]) {
                            return results.push({
                                path  : [ "items", id, key ],
                                value : {
                                    $type : "error",
                                    value : "Unknown field"
                                }
                            });
                        }
                        
                        results.push({
                            path  : [ "items", id, key ],
                            value : map[id][key]
                        });
                    });
                });
                
                return results;
            });
    }
}, {
    route : "items[{integers:ids}]['buys', 'sells']['price', 'quantity']",
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
                                    path  : [ "items", id, type, field ],
                                    value : {
                                        $type : "error",
                                        value : "Unknown item"
                                    }
                                });
                            }
                            
                            results.push({
                                path  : [ "items", id, type, field ],
                                value : map[id][type][field === "price" ? "unit_price" : field]
                            });
                        });
                    });
                });
                
                return results;
            });
    }
} ]);
