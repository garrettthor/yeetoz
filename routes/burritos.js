const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Burrito = require('../models/burrito');
const Review = require('../models/review');
const { burritoValidateSchema, reviewValidateSchema } = require('../schemas.js');

// Validation Errors
const validateBurrito = (req, res, next) => {
    const { error } = burritoValidateSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

// Routes
router.get('/', catchAsync(async (req, res) => {
    const burritos = await Burrito.find({});
    // const sortedList = burritos.sort((a,b) => a.price-b.price)
    // console.log(sortedList)
    res.render('burritos/index', { burritos });
}));

router.get('/new', (req, res) => {
    res.render('burritos/new');
});

router.post('/', validateBurrito, catchAsync(async (req, res, next) => {
    // Rudimentary logic to detect if the body contains burrito at all
    // if(!req.body.burrito) throw new ExpressError('Invalid Burrito Data', 400);
    const burrito = new Burrito(req.body.burrito);
    await burrito.save();
    req.flash('success', 'Successfully made a new burrito!');
    res.redirect(`burritos/${burrito._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const burrito = await Burrito.findById(req.params.id).populate('reviews');
    if(!burrito){
        req.flash('error', 'Burrito doesn\'t exist...');
        return res.redirect('/burritos');
    }
    res.render('burritos/show', { burrito });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    res.render('burritos/edit', { burrito });
}));

router.put('/:id', validateBurrito, catchAsync(async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito }, { useFindAndModify: false });
    req.flash('success', 'Successfully updated burrito!')
    res.redirect(`${burrito._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Burrito.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash('success', 'Successfully YEETed the burrito!  Get outa here!');
    res.redirect('/burritos');
}));

module.exports = router;