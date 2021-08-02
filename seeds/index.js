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
    await Campground.deleteMany({})
    const sample = array => array[Math.floor(Math.random()* array.length)]

    //lopps 50 times concatonates random city/state then saves it to db using campground model
    for (let i = 1; i < 150; i++){
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100);
        let location = await `${cities[randomNum].city}, ${cities[randomNum].state}`
        let name = await `${sample(descriptors)} ${sample(places)}`
        let images = [{
        //     url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/w_200/v1627920204/YelpCamp/dapqz4h6mwlmpjigz1mq.jpg',
        //     filename: ' YelpCamp/dapqz4h6mwlmpjigz1mq'
        // },
        //     {
        //         url:'https://res.cloudinary.com/shawn27599999990987/image/upload/w_200/v1627920473/YelpCamp/ize75rsasvwvgv5umfsv.jpg',
        //         filename: 'YelpCamp/ize75rsasvwvgv5umfsv'
        //     }
            
                url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/w_200/v1627920745/YelpCamp/mne4rg25gr7fnmm1ymjt.jpg',
               filename: 'YelpCamp/ mne4rg25gr7fnmm1ymjt'
            },
            {
                url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/w_200/v1627920784/YelpCamp/ijrnbclmvxtm6yoehoho.jpg',
                filename: 'YelpCamp/ ijrnbclmvxtm6yoehoho'
            }

        //     url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/v1627514565/YelpCamp/pwbno5qfejy94wzbgs6x.jpg',
        //     filename: 'YelpCamp/pwbno5qfejy94wzbgs6x'
        //   },
        //   {
        //     url: 'https://res.cloudinary.com/shawn27599999990987/image/upload/v1627514565/YelpCamp/no0swjvvhr1egb5bzpry.jpg',
        //     filename: 'YelpCamp/no0swjvvhr1egb5bzpry'
        //   }
        ]
            
        let desc = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit distinctio libero et doloremque exercitationem, consectetur temporibus quis vitae sunt animi sed unde doloribus quod quae id, voluptate odio, alias cumque?`
        const camp = new Campground({
            title: name,
            location: location,
            images: images,
            description: desc, 
            price: price,
            //shawn user id
            author: '60ff3207018470303fa1f8b8',
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
    mongoose.connection.closed
})