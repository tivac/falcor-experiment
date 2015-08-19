"use strict";

module.exports = require("falcor-router").createClass([ {
    // match a request for the key "greeting"    
    route : "greeting",
    
    // respond with a PathValue with the value of "Hello World."
    get : function() {
        return {
            path : [
                "greeting"
            ],
            
            value : "Hello World"
        };
    }
} ]);
