"use strict";

var falcor = require("falcor"),
    HttpDS = require("falcor-http-datasource"),
    m      = require("mithril"),
    
    styles = require("./client.css"),
    
    model  = new falcor.Model({
        source : new HttpDS("/model.json")
    });

model.get("items[0..10]['id', 'name']").then(function(response) {
    console.log("items[0..10]['id', 'name']", response.json);
});

m.mount(document.body, {
    controller : function() {
        console.log("styles", styles);
    },
    
    view : function() {
        return m(".items", m(".item", { class : styles.item }, "ITEM"));
    }
});
