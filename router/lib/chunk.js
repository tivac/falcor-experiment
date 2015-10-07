var chunk = require("chunk"),
    http  = require("../../lib/http");

module.exports = function(url, ids) {
    return Promise.all(chunk(ids, 200).map(function(segment) {
        return http.json(url + segment.join(","));
    }))
    .then(function(chunks) {
        return Array.prototype.concat.apply([], chunks);
    });
};
