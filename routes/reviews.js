const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Burrito = require('../models/burrito');
const Review = require('../models/review');
const { reviewValidateSchema, burritoValidateSchema } = require('../schemas.js');

// Validation Errors
const validateReview = (req, res, next) => {
    const { error } = reviewValidateSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

// Routes
router.post('/', validateReview, catchAsync(async(req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    const review = new Review(req.body.review);
    burrito.reviews.push(review);
    await review.save();
    await burrito.save();
    req.flash('success', 'New review added!');
    res.redirect(`/burritos/${burrito._id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Burrito.findByIdAndUpdate(id, {$pull: {reviews: reviewId } }, { useFindAndModify: false });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully YEETed that review!')
    res.redirect(`/burritos/${id}`);
}));

module.exports = router;