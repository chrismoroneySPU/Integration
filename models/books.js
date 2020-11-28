const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BookSchema = new Schema({
    Name: String,
    Author: String,
    ISBN: String,
    Price: String
});

module.exports = mongoose.model('book', BookSchema);

