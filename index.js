const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Burrito = require('./models/burrito')
const PORT = 1984;

// Connection to the local database through mongoose.
mongoose.connect('mongodb://localhost:27017/yeetoz', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de connecion:'));
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



// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/burritos', async (req, res) => {
    const burritos = await Burrito.find({});
    res.render('burritos/index', { burritos });
});

app.get('/burritos/new', (req, res) => {
    res.render('burritos/new');
});

app.post('/burritos', async (req, res) => {
    const burrito = new Burrito(req.body.burrito);
    await burrito.save();
    res.redirect(`burritos/${burrito._id}`);
});

app.get('/burritos/:id', async (req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    res.render('burritos/show', { burrito });
});

app.get('/burritos/:id/edit', async (req, res) => {
    const burrito = await Burrito.findById(req.params.id);
    res.render('burritos/edit', { burrito });
});

app.put('/burritos/:id', async (req, res) => {
    const { id } = req.params;
    const burrito = await Burrito.findByIdAndUpdate(id, { ...req.body.burrito });
    res.redirect(`${burrito._id}`);
});

app.delete('/burritos/:id', async (req, res) => {
    const { id } = req.params;
    await Burrito.findByIdAndDelete(id);
    res.redirect('/burritos');
});



app.listen(PORT, () => {
    console.log(`Escuchando a PORT: ${PORT}.  Vámanos pues.`);
});