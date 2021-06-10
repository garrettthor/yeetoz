const express = require('express');
const router = express.Router();
const burritos = require('../controllers/burritos')
const catchAsync = require('../utilities/catchAsync');
// Load middleware
const { isLoggedIn, isAuthor, validateBurrito } = require('../middleware')

// Routes
router.get('/', catchAsync(burritos.index));

router.get('/new', isLoggedIn, burritos.renderNewForm);

router.post('/', isLoggedIn, validateBurrito, catchAsync(burritos.createBurrito));

router.get('/:id', catchAsync(burritos.showBurrito));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(burritos.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateBurrito, catchAsync(burritos.updateBurrito));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(burritos.deleteBurrito));

module.exports = router;