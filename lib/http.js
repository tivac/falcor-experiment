"use strict";

var LRU = require("lru-cache"),

    cache = new LRU({
        max    : 100,
        maxAge : 1000 * 60 * 5 // 5 minutes
    });

function cached(key, fn) {
    var item;

    if(cache.has(key)) {
        console.log("Getting %s from cache", key); // TODO: REMOVE DEBUGGING

        return cache.get(key);
    }

    item = fn();

    cache.set(key, item);

    return item;
}

function http(url, options) {
    return cached("http:" + url, function() {
        return fetch(url, options);
    });
}

http.json = function(url, options) {
    return cached("json:" + url, function() {
        return fetch(url, options).then(function(response) {
            return response.json();
        });
    });
};

module.exports = http;
