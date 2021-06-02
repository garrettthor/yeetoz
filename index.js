const express = require('express');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');

const PORT = 1984;


//  ALL THIS SHIT GOT MOVED INTO OTHER FILES WHERE THEY ARE APPLICABLE.  NO LONGER NEEDED HERE, just left them commented out to leave some breadcrumbs... nom nom nom
// const Joi = require('joi');
// const { burritoValidateSchema } = require('./schemas.js');
// const { reviewValidateSchema } = require('./schemas.js');
// const catchAsync = require('./utilities/catchAsync');
// const Burrito = require('./models/burrito');
// const Review = require('./models/review');

// Requiring the route files
const burritos = require('./routes/burritos');
const reviews = require('./routes/reviews');

// Connection to the local database through mongoose.
mongoose.connect('mongodb://localhost:27017/yeetoz', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,

    // I have this already written into one of the edit routes I believe, but it could be declared here in place
    // useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    //store: needed once this ain't local
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: (1000*60*60*24*7)
    }
}
app.use(session(sessionConfig));
app.use(flash());

// These have also been moved to other files where they are applicable.  Leaving here to just show the wayyy

// Validation Errors
// const validateBurrito = (req, res, next) => {
//     const { error } = burritoValidateSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     };
// };

// const validateReview = (req, res, next) => {
//     const { error } = reviewValidateSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     };
// };

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// This sets the routes to the above referenced variables.  It's best to place 'burritos' here, and '/' in the route files so you could make drastic changes HERE, and only once.  As opposed to, say, changing every instance of /burritos/ elsewhere.  :)
app.use('/burritos', burritos);
app.use('/burritos/:id/reviews', reviews);

// ROUTES
router.get('/', (req, res) => {
    res.render('home');
});

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