"use strict";

var axios = require("axios"),

    $error = require("falcor").Model.error,
    
    mapIds = require("./lib/map-ids");

function get(ids) {
    return axios.get(
        "https://api.guildwars2.com/v2/colors?ids=" + ids.join(",")
    )
    .then(mapIds);
}

function rgb(base, fn) {
    return {
        route : base + "['red', 'green', 'blue']",
        get   : function(pathSet) {
            return get(pathSet.ids)
            .then(function(map) {
                var results = [];
                
                pathSet.ids.forEach(function(id) {
                    if(!map[id]) {
                        return results.push({
                            path  : [ pathSet[0], id ],
                            value : $error("Unknown color")
                        });
                    }
                    
                    pathSet[pathSet.length - 1].forEach(function(field) {
                        // WARNING: This path calculation is a little gnarly...
                        var path  = [ pathSet[0], id ].concat(pathSet.slice(2, -1), field),
                            idx   = [ "red", "green", "blue" ].indexOf(field),
                            value = fn(map[id], idx);
                        
                        if(!value) {
                            return results.push({
                                path  : path,
                                value : $error("Unknown field")
                            });
                        }
                        
                        results.push({
                            path  : path,
                            value : value
                        });
                    });
                });
                
                return results;
            });
        }
    };
}

function material(type) {
    return {
        route : "colorsById[{integers:ids}]." + type + "['brightness', 'contrast', 'hue', 'saturation', 'lightness']",
        get   : function(pathSet) {
            return get(pathSet.ids)
            .then(function(map) {
                var results = [];
                
                pathSet.ids.forEach(function(id) {
                    if(!map[id]) {
                        return results.push({
                            path  : [ pathSet[0], id ],
                            value : $error("Unknown color")
                        });
                    }
                    
                    pathSet[3].forEach(function(field) {
                        var path = [ pathSet[0], id, type, field ];
                        
                        if(!map[id][type][field]) {
                            return results.push({
                                path  : path,
                                value : $error("Unknown field")
                            });
                        }
                        
                        results.push({
                            path  : path,
                            value : map[id][type][field]
                        });
                    });
                });
                
                return results;
            });
        }
    };
}

module.exports = [ {
    route : "colorsById[{integers:ids}]['name', 'id']",
    get   : function(pathSet) {
        return get(pathSet.ids)
        .then(function(map) {
            var results = [];
            
            pathSet.ids.forEach(function(id) {
                if(!map[id]) {
                    return results.push({
                        path  : [ pathSet[0], id ],
                        value : $error("Unknown color")
                    });
                }
                
                pathSet[2].forEach(function(field) {
                    var path = [ pathSet[0], id, field ];
                        
                    if(!map[id][field]) {
                        return results.push({
                            path  : path,
                            value : $error("Unknown field")
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
},

rgb("colorsById[{integers:ids}].base", function(color, idx) {
    return color.base_rgb[idx];
}),

material("cloth"),
rgb("colorsById[{integers:ids}].cloth.rgb", function(color, idx) {
    return color.cloth.rgb[idx];
}),

material("leather"),
rgb("colorsById[{integers:ids}].leather.rgb", function(color, idx) {
    return color.leather.rgb[idx];
}),

material("metal"),
rgb("colorsById[{integers:ids}].metal.rgb", function(color, idx) {
    return color.metal.rgb[idx];
})
];
