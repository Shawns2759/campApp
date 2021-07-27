const express = require('express')
//lets params.id be accesed 
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')
const Review = require('../models/review')

const Campground = require('../models/campground')
const { loggedIn, validateReview } = require('../utils/middlewear')

router.use(express.urlencoded({ extended: true }))



router.post('/', loggedIn,  validateReview ,catchAsync(async (req, res) => {
    const id  = req.params.id
    const campground = await Campground.findById(id).populate('reviews')
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
}))

router.delete('/:reviewId', loggedIn,catchAsync(async (req, res) => { 
    const { id, reviewId } = req.params
    //finds camp by id and pulls every instance of reviewID out of reviews arr
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    const review = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router