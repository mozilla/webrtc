'use strict';

var DEBUG = false;
var debug = function(msg) {
        if (DEBUG) {
            console.warn("<!-- " + msg + " -->");
        }
    };

debug.die = function(msg) {
    console.error("ERROR: " + msg);
    throw msg;
};

debug.enable = function() {
    DEBUG = true;
};


module.exports = debug;