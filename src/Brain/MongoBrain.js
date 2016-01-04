const mongoose = require('mongoose');

module.exports = function(mongoUrl) {
    mongoose.connect(mongoUrl);

    return mongoose;
};