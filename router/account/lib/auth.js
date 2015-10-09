"use strict";

module.exports = function requireAPIKey(fn) {
    return function(pathset) {
        if(!this.key) {
            throw new Error("No API key specified");
        }
        
        return fn(this.key, pathset);
    };
};
