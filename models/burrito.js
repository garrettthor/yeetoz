const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const BurritoSchema = new Schema({
    title: String,
    date: Date,
    image: String,
    description: String,
    price: Number,
    location: String,
    restaurant: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
        ref: 'Review'
        } 
    ]
});

BurritoSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Burrito', BurritoSchema);