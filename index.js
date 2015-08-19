"use strict";

var falcor  = require("falcor-express"),
    express = require("express"),
    
    Router  = require("./router"),
    
    app     = express();

app.use(require("body-parser").text({ type: "text/*" }));

app.use("/model.json", falcor.dataSourceRoute(function() {
    return new Router();
}));

app.use(express.static("."));

app.listen(9090, function(err) {
    if(err) {
        return console.error(err);
    }
    
    console.log("navigate to http://localhost:9090");
});
