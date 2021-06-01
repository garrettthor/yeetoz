const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { burritoValidateSchema } = require('./schemas.js');
const { reviewValidateSchema } = require('./schemas.js')
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Burrito = require('./models/burrito');
const Review = require('./models/review');
const PORT = 1984;

// Connection to the local database through mongoose.
mongoose.connect('mongodb://localhost:27017/yeetoz', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
    console.log(`Hola, estamos conectados a ${db.name}.`);
});

const app = express();



// Set up using ejs-mate
app.engine('ejs', ejsMate);
// Setting up express to use ejs
app.set('view engine', 'ejs');
// Sets up express to use path, allowing easier pathfinding
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


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

const validateReview = (req, res, next) => {
    const { error } = reviewValidateSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};


// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/burritos', catchAsync(async (req, res) => {
    const burritos = await Burrito.find({});
    res.render('burritos/index', { burritos });
}));

app.get('/burritos/new', (req, res) => {
    res.render('burritos/new');
});

app.post('/burritos', validateBurrito, catchAsync(async (req, res, next) => {
    // Rudimentary logic to detect if the body contains burrito at all
    // if(!req.body.burrito) throw new ExpressError('Invalid Burrito Data', 400);

    const burrito = new Burrito(req.body.burrito);
    await burrito.save();
    res.redirect(`burritos/${burrito._id}`);
}));

app.get('/burritos/:id', catchAsync(async (req, res) => {
    const burrito = await Burrito.findById(req.params.id).populate('reviews');
    res.render('burritos/show', { burrito });
}));

app.get('/burritos/:id/edit', catchAsync(async (req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    res.render('burritos/edit', { burrito });
}));

app.put('/burritos/:id', validateBurrito, catchAsync(async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito }, { useFindAndModify: false });
    res.redirect(`${burrito._id}`);
}));

app.delete('/burritos/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Burrito.findByIdAndDelete(id, { useFindAndModify: false });
    res.redirect('/burritos');
}));

app.post('/burritos/:id/reviews', catchAsync(async(req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    const review = new Review(req.body.review);
    burrito.reviews.push(review);
    await review.save();
    await burrito.save();
    res.redirect(`/burritos/${burrito._id}`)
}));

app.delete('/burritos/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Burrito.findByIdAndUpdate(id, {$pull: {reviews: reviewId } }, { useFindAndModify: false });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/burritos/${id}`);
}));




// Error Handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No!  Something Went Terribly Wrong!';
    res.status(statusCode).render('error', { err });
});



// Listen on PORT
app.listen(PORT, () => {
    console.log(`Escuchando a PORT: ${PORT}.  Vámanos pues.`);
});