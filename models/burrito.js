const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BurritoSchema = new Schema({
    title: String,
    date: Date,
    image: String,
    description: String,
    price: Number,
    location: String,
    restaurant: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
        ref: 'Review'
        } 
    ]
});

module.exports = mongoose.model('Burrito', BurritoSchema);