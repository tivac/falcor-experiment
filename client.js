"use strict";

var m = require("mithril");

if(location.hash.length) {
    sessionStorage.setItem("key", location.hash.slice(1));
}

m.route(document.body, "/", {
    "/" : require("./pages/home"),
    
    "/missing-dyes" : require("./pages/missing-dyes")
});
