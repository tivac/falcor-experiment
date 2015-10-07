"use strict";

var m   = require("mithril"),
    obj = require("object-path"),

    _model = require("../model");

function rgb(colors) {
    return "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")";
}

module.exports = {
    controller : function() {
        var ctrl  = this,
            model = _model(sessionStorage.getItem("key"));
        
        ctrl.sort = m.prop("name");
        ctrl.dir = m.prop(true);
        
        // Go get data
        model.get(
            [ "account", "dyes", "length" ],
            [ "colors", "length" ]
        )
        .then(function(response) {
            if(response.json.account.dyes.length >= response.json.colors.length) {
                return console.log("YOU HAVE IT ALL MY FRIEND");
            }

            return model.get(
                [ "account", "dyes", { to : response.json.account.dyes.length - 1 }, "id" ],
                [ "colors", { to : response.json.colors.length - 1 }, "id"]
            );
        })
        .then(function(response) {
            var have = Object.keys(response.json.account.dyes).map(function(key) {
                    return response.json.account.dyes[key].id;
                }),
                want = Object.keys(response.json.colors).map(function(key) {
                    return response.json.colors[key].id;
                }),
                need = want.filter(function(id) {
                    return have.indexOf(id) === -1;
                });

            return model.get(
                [ "colorsById", need, [ "id", "name", "cloth", "leather", "metal" ] ],
                [ "colorsById", need, "item", "id" ],
                [ "colorsById", need, "item", "prices", "sells", [ "quantity", "unit_price" ] ]
            );
        })
        .then(
            function(response) {
                ctrl.vm = Object.keys(response.json.colorsById).map(function(id) {
                    return response.json.colorsById[id];
                }).sort(ctrl.sorter);
                
                m.redraw();
            },
            function(error) {
                ctrl.error = error;
                
                m.redraw();
            }
        );

        // Data sorting
        ctrl.sorter = function(a, b) {
            var sort = ctrl.sort();

            a = obj.get(a, sort);
            b = obj.get(b, sort);

            if(typeof a === "string") {
                return ctrl.dir() ? a.localeCompare(b) : b.localeCompare(a);
            }

            return ctrl.dir() ? a - b : b - a;
        };

        // Event handler
        ctrl.onsort = function(sort) {
            if(sort === ctrl.sort()) {
                ctrl.dir(!ctrl.dir());
            } else {
                ctrl.sort(sort);
                ctrl.dir(true);
            }

            ctrl.vm = ctrl.vm.sort(ctrl.sorter);
        };

        // View helper
        ctrl.contents = function() {
            if(!ctrl.vm && !ctrl.error) {
                return m("p", "Loading...");
            }
            
            if(ctrl.error) {
                return m("p", "ERROR! " + ctrl.error.toString());
            }
            
            return m("div",
                m("p",
                    "Sorting: ",
                    m("button", {
                        "data-sort" : "name",
                        
                        onclick : m.withAttr("data-sort", ctrl.onsort)
                    }, "Name"),
                    m("button", {
                        "data-sort" : "item.prices.sells.unit_price",
                        
                        onclick : m.withAttr("data-sort", ctrl.onsort)
                    }, "Price")
                ),
                m("ol",
                    ctrl.vm.map(function(color) {
                        if(!color.item.prices) {
                            return "";
                        }
                        
                        return m("li", { key : color.id },
                            m("p", color.name + " (" + color.id + ") " + color.item.prices.sells.unit_price),
                            m("p",
                                m("span", { style : { color : "#FFF", backgroundColor : rgb(color.leather.rgb) } }, "leather"),
                                m("span", { style : { color : "#FFF", backgroundColor : rgb(color.metal.rgb) } }, "metal"),
                                m("span", { style : { color : "#FFF", backgroundColor : rgb(color.cloth.rgb) } }, "cloth")
                            )
                        );
                    })
                )
            );
        };
    },
    
    view : function(ctrl) {
        return m("div",
            m("h1", "Missing dyes"),
            ctrl.contents()
        );
    }
};
