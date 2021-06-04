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
        const price = Math.floor(Math.random() * 10);
        const burro = new Burrito({
            author: '60cb8cf2e99f2113369b08af',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(types)} burrito.`,
            restaurant: `${sample(restaurants)}`,
            image: 'https://source.unsplash.com/collection/1904544',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium. Nec dui nunc mattis enim ut tellus. Elit duis tristique sollicitudin nibh sit amet commodo nulla. Sit amet volutpat consequat mauris. Enim ut sem viverra aliquet eget sit amet tellus. Pellentesque dignissim enim sit amet venenatis urna. Mauris ultrices eros in cursus turpis massa. In iaculis nunc sed augue lacus viverra vitae congue eu. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada. Suscipit adipiscing bibendum est ultricies. Aliquam id diam maecenas ultricies mi.',
            price
        })
    await burro.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});