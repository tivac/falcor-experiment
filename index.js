"use strict";

var falcor  = require("falcor-express"),
    express = require("express"),
    
    Router  = require("./router"),
    
    app     = express();

app.use(require("body-parser").text({ type: "text/*" }))

app.use("/model.json", falcor.dataSourceRoute(function(req, res) {
    return new Router();
}));

app.use(express.static("."));

var server = app.listen(9090, function(err) {
    if(err) {
        return console.error(err);
        return;
    }
    
    console.log("navigate to http://localhost:9090")
});
