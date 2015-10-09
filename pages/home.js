"use strict";

var m = require("mithril"),

    model = require("../model"),
    
    key = sessionStorage.getItem("key"),
        
    form, tools;

form = {
    controller : function() {
        this.input = m.prop("");
        
        this.onsubmit = function(e) {
            e.preventDefault();
            
            key = this.input();
            sessionStorage.setItem("key", key);
        };
    },
    
    view : function(ctrl) {
        return m("form", {
                onsubmit : ctrl.onsubmit.bind(ctrl)
            },
            m("input", {
                placeholder : "Enter API Key",
                oninput     : m.withAttr("value", ctrl.input)
            })
        );
    }
};

tools = {
    view : function(ctrl, parent) {
        return m("ul",
            m("li",
                m("a[href='/missing-dyes']", { config : m.route }, "Missing Dye Cost Calculator")
            )
        );
    }
};
    
module.exports = {
    view : function() {
        return m("div",
            m("h1", "Home"),
            m.component(key ? tools : form)
        );
    }
};
