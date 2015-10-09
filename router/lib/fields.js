"use strict";

var Model  = require("falcor").Model,
    $atom  = Model.atom,
    $error = Model.error;

module.exports = function fields(paths, fields, base, item) {
    if(!item) {
        return;
    }
    
    fields.forEach(function(field) {
        if(field in item) {
            return paths.push({
                path  : base.concat(field),
                value : $atom(item[field])
            });
        }
        
        paths.push({
            path  : base.concat(field),
            value : $error("Invalid field")
        });
    });
};
