const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookSchema = new Schema({
    Name: String,
    Author: String,
    ISBN: String,
    Price: String.toFixed(2)
});

module.exports = mongoose.model('book', BookSchema);

