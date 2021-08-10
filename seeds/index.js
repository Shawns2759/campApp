const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
require('dotenv').config()
mongoose.connect(process.env.DB_URL,{
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
    await Campground.deleteMany({})
    const sample = array => array[Math.floor(Math.random()* array.length)]

    //lopps 50 times concatonates random city/state then saves it to db using campground model
    for (let i = 1; i < 150; i++){
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100);
        let location = await `${cities[randomNum].city}, ${cities[randomNum].state}`
        let name = await `${sample(descriptors)} ${sample(places)}`
        let images = [
            {
            url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/v1628618965/YelpCamp/tb0qexzoqjfsutjrsol1.jpg',
            filename: 'YelpCamp/tb0qexzoqjfsutjrsol1',
            },
            {
                url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/v1628619909/YelpCamp/arpybidj2b3s0znrgivq.jpg',
                filename: 'YelpCamp/arpybidj2b3s0znrgivq'
            },
            {
                url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/v1628620086/YelpCamp/hhxft3ecquq0jayrlhvi.jpg',
                filename: 'YelpCamp/hhxft3ecquq0jayrlhvi'
            },
            {
                url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/v1628620156/YelpCamp/agqielu9fk5kmv9aizoy.jpg',
                filename: 'YelpCamp/agqielu9fk5kmv9aizoy'
            }

        ]
        let imgArr = []
        let randd = Math.floor(Math.random() * images.length)
        for (img of images){
            imgArr.push(images[randd])
            console.log(imgArr)
        }
        let desc = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit distinctio libero et doloremque exercitationem, consectetur temporibus quis vitae sunt animi sed unde doloribus quod quae id, voluptate odio, alias cumque?`
        const camp = new Campground({
            title: name,
            location: location,
            images: images,
            description: desc, 
            price: price,
            //shawn user id
            author: '61119c1143411f963c899887',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomNum].longitude,
                    cities[randomNum].latitude
                ]
            }
    })
        camp.save();
    }

    //makes sure db is writing
    let foundCamp = await Campground.find()
    console.log(foundCamp)
}
seedDB().then(() => {
    mongoose.connection.close
})