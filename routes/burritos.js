const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Burrito = require('../models/burrito');

const { isLoggedIn, isAuthor, validateBurrito } = require('../middleware')

// Routes
router.get('/', catchAsync(async (req, res) => {
    const burritos = await Burrito.find({});
    // const sortedList = burritos.sort((a,b) => a.price-b.price)
    // console.log(sortedList)
    res.render('burritos/index', { burritos });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('burritos/new');
});

router.post('/', isLoggedIn, validateBurrito, catchAsync(async (req, res, next) => {
    // Rudimentary logic to detect if the body contains burrito at all
    // if(!req.body.burrito) throw new ExpressError('Invalid Burrito Data', 400);
    const burrito = new Burrito(req.body.burrito);
    burrito.author = req.user._id;
    await burrito.save();
    req.flash('success', 'Successfully made a new burrito!');
    res.redirect(`burritos/${burrito._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const burrito = await (await Burrito.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    console.log(burrito); 
    if(!burrito){
        req.flash('error', 'Burrito doesn\'t exist...');
        return res.redirect('/burritos');
    }
    res.render('burritos/show', { burrito });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findById(id);
    if (!burrito) {
        req.flash('error', 'Cannot find that burrito');
        return res.redirect('/burritos');
    }
    res.render('burritos/edit', { burrito });
}));

router.put('/:id', isLoggedIn, isAuthor, validateBurrito, catchAsync(async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito }, { useFindAndModify: false });
    req.flash('success', 'Successfully updated burrito!')
    res.redirect(`${burrito._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Burrito.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash('success', 'Successfully YEETed the burrito!  Get outa here!');
    res.redirect('/burritos');
}));

module.exports = router;