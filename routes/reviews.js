const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const Burrito = require('../models/burrito');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

// Routes
router.post('/', validateReview, isLoggedIn, catchAsync(async(req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    burrito.reviews.push(review);
    await review.save();
    await burrito.save();
    req.flash('success', 'New review added!');
    res.redirect(`/burritos/${burrito._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Burrito.findByIdAndUpdate(id, {$pull: {reviews: reviewId } }, { useFindAndModify: false });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully YEETed that review!')
    res.redirect(`/burritos/${id}`);
}));

module.exports = router;