const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BurritoSchema = new Schema({
    title: String,
    date: Date,
    image: String,
    description: String,
    price: Number,
    type: String,
    location: String,
    restaurant: String
});

module.exports = mongoose.model('Burrito', BurritoSchema);