"use strict";

module.exports = require("falcor-router").createClass(
    // Flatten the arrays each routes file exposes using concat.apply
    Array.prototype.concat.apply([], [
        require("./items"),
        require("./itemsById"),
        require("./recipes"),
        require("./recipesById")
    ])
);
