const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
        url: String, 
        filename: String
})
//adds virtual function to image schema(named thumbnail)
ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace('/upload', "/upload/w_200");
})
const CampgroundSchema = new Schema({
    title: String, 
    price: Number, 
    description: String, 
    location: String,
    images: [ImageSchema],
    author: {
        //links  this campground with a author
        type: Schema.Types.ObjectID,
        ref: 'User'
    },
    reviews: [
        {
            //links review collection to this collection by objectid
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
