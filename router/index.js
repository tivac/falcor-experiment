"use strict";

var util = require("util"),

    Base = require("falcor-router").createClass(
        // Flatten the arrays each routes file exposes using concat.apply
        Array.prototype.concat.apply([], [
            require("./items"),
            require("./itemsById"),
            require("./colors"),
            require("./colorsById"),
            require("./recipes"),
            require("./recipesById"),
            require("./account/dyes")
        ])
    );

function ApiRouter(key) {
    Base.call(this);
    
    this.key = key;
}

util.inherits(ApiRouter, Base);

module.exports = ApiRouter;
