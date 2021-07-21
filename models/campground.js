const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String, 
    price: Number, 
    description: String, 
    location: String,
    image: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//when findoneandelete is called this is the middlewear, it runs post exicution, doc is what was deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        //deletes all reviews where _id is in doc
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
} )
module.exports = mongoose.model('Campground', CampgroundSchema)
