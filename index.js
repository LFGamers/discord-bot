'use strict';

global.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

const Bot = require('./src/Bot');

new Bot();
