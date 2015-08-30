"use strict";

module.exports = function requireAPIKey(fn) {
    return function(pathSet) {
        if(!this.key) {
            throw new Error("No API key specified");
        }
        
        return fn(pathSet, this.key);
    };
};
