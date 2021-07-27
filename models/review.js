const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number, 
    author: {
        //associates author of review to review
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema  )