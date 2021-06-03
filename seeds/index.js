const mongoose = require('mongoose');
const cities = require('./cities')
const Burrito = require('../models/burrito');
const { types, descriptors, restaurants } = require('./seedHelpers');

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Burrito.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const burro = new Burrito({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(types)} burrito.`,
            restaurant: `${sample(restaurants)}`
        })
    await burro.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});