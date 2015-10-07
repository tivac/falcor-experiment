"use strict";

var build = require("browserify")();

build.add("./client.js");

build.plugin(require("css-modulesify"), {
  rootDir : ".",
  output  : "./output/styles.css"
});

build.bundle(function(err, buf) {
    if(err) {
        throw new Error(err);
    }
    
    require("fs").writeFileSync("./output/scripts.js", buf);
});
