"use strict";

var falcor = require("falcor"),
    HttpDS = require("falcor-http-datasource"),
    m      = require("mithril"),
    
    styles = require("./items.css"),
    
    model  = new falcor.Model({
        source : new HttpDS("/model.json")
    });



m.mount(document.body, {
    controller : function() {
        var ctrl = this;
        
        ctrl._items = {};
        
        ctrl.items = function() {
            var results = [],
                key;
                
            for(key in ctrl._items) {
                results.push(ctrl._items[key]);
            }
            
            return results;
        };
        
        model.get(
            "items[100..150]['id', 'name', 'icon']",
            "items[100..150]['buys', 'sells']['quantity','price']"
        )
        .then(function(response) {
            ctrl._items = response.json.items;
            
            m.redraw();
        });
    },
    
    view : function(ctrl) {
        console.log(ctrl.items());
        
        return m("div", { "class" : styles.items },
            ctrl.items().map(function(item) {
                return m("div", {
                        "class"   : styles.item,
                        "data-id" : item.id
                    },
                    m("img", { src : item.icon }),
                    m("div", { "class" : styles.name }, item.name),
                    m("div", { "class" : styles.buys },
                        "Buying " + item.buys.quantity + " for " + item.buys.price
                    ),
                    m("div", { "class" : styles.sells },
                        "Selling " + item.sells.quantity + " for " + item.sells.price
                    )
                );
            })
        );
    }
});
