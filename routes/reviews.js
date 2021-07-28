const express = require('express')
//lets params.id be accesed 
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const Campground = require('../models/campground')
const { loggedIn, validateReview, isReviewAuthor } = require('../utils/middlewear')

router.use(express.urlencoded({ extended: true }))



router.post('/', loggedIn,  validateReview ,catchAsync(reviews.createReview))

router.delete('/:reviewId', loggedIn, isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router