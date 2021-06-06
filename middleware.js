const { burritoValidateSchema, reviewValidateSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const Burrito = require('./models/burrito');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER...', req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateBurrito = (req, res, next) => {
    const { error } = burritoValidateSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const burrito = await Burrito.findById(id);
    if (!burrito.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/burritos/${id}`)
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewValidateSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

module.exports.isReviewAuthor = async(req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/burritos/${id}`)
    }
    next();
};