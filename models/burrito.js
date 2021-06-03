const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BurritoSchema = new Schema({
    title: String,
    price: String,
    type: String,
    location: String,
    restaurant: String
});

module.exports = mongoose.model('Burrito', BurritoSchema);