"use strict";

var falcor = require("falcor"),
    
    Router = require("./router/"),
    model;

module.exports = function(key) {
    if(model) {
        return model;
    }
    
    model = new falcor.Model({
        source : new Router(key)
    });
    
    global.model = model;
    
    return model
};
