const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const id  = req.params.id
    const campground = await (await Campground.findById(id).populate('reviews').populate('users'))
    if(!campground) {
        req.flash('error', 'Campground Not Fount')
        res.redirect('/campgrounds')
    }
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    review.author = req.user._id
    await review.save()
    await campground.save()
    req.flash('success', 'Created New Review')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteReview = async (req, res) => { 
    const { id, reviewId } = req.params
    //finds camp by id and pulls every instance of reviewID out of reviews arr
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    const review = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}