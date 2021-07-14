const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    //clears db
    // await Campground.deleteMany({})
    const sample = array => array[Math.floor(Math.random()* array.length)]

    //lopps 50 times concatonates random city/state then saves it to db using campground model
    for (let i = 1; i < 50; i++){
        const randomNum = Math.floor(Math.random() * 1000);
        let location = await `${cities[randomNum].city}, ${cities[randomNum].state}`
        let name = await `${sample(descriptors)} ${sample(places)}`
        console.log(name)
        const camp = new Campground({
            title: name,
            location : location
    })
        camp.save();
    }

    //makes sure db is writing
    let foundCamp = await Campground.find()
    console.log(foundCamp)
}
seedDB().then(() => {
    mongoose.connection.close()
})