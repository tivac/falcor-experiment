"use strict";

var build = require("browserify")();

build.add("./public/items.js");

build.plugin(require("css-modulesify"), {
  rootDir : ".",
  output  : "./public/output/styles.css"
});

build.bundle(function(err, buf) {
    if(err) {
        throw new Error(err);
    }
    
    require("fs").writeFileSync("./public/output/scripts.js", buf);
});
