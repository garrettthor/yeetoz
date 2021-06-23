const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
// Load controller for burritos
const burritos = require('../controllers/burritos')
// Load utilities
const catchAsync = require('../utilities/catchAsync');
// Load middleware
const { isLoggedIn, isAuthor, validateBurrito } = require('../middleware')

// Routes

router.route('/')
    .get(catchAsync(burritos.index))
    .post(isLoggedIn, upload.array('image'), validateBurrito, catchAsync(burritos.createBurrito));

router.get('/new', isLoggedIn, burritos.renderNewForm);

router.route('/:id')
    .get(catchAsync(burritos.showBurrito))
    .put(isLoggedIn, isAuthor, validateBurrito, catchAsync(burritos.updateBurrito))
    .delete(isLoggedIn, isAuthor, catchAsync(burritos.deleteBurrito));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(burritos.renderEditForm));

module.exports = router;