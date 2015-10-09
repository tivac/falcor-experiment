"use strict";

var util = require("util"),
    
    Base = require("falcor-router").createClass(
        // Flatten the arrays each routes file exposes using concat.apply
        Array.prototype.concat.apply([], [
            require("./colors"),
            require("./colorsById"),
            require("./items/"),
            require("./items/itemsById"),
            require("./items/pricesById"),
            require("./items/listingsById"),
            // require("./recipes"),
            // require("./recipesById"),
            // require("./skins"),
            // require("./skinsById"),
            
            // Account APIS (require a key)
            require("./account/dyes"),
            // require("./account/skins")
        ])
    );

function ApiRouter(key) {
    Base.call(this);
    
    this.key = key;
}

util.inherits(ApiRouter, Base);

module.exports = ApiRouter;
