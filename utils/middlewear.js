const { campgroundSchema, reviewSchema } = require('../schemas')
const ExpressError = require('./ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
//passport checks session to see if you are authenticated

module.exports.loggedIn = (req, res, next) => {
    //sets return to on sesh to originalurl which is the url pre redirect
    console.log(req.path)
    //need to make sure return path is not === to post path to reviews
    req.session.returnTo = req.originalUrl
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    } 
    next()
}


module.exports.validateCampground = (req, res, next) => {
    //gets error form campgroundSchema aka validation schema with joi
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(error.message, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    //takes params id from url finds campground by them then checks if campground.author === req.use._id from session if so user is author
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'you do not have the correct permissions')
        return res.redirect(`/campgrounds/${id}`)
    }
        next()

}

module.exports.isReviewAuthor = async (req, res, next) => {
    //takes params id from url finds campground by them then checks if campground.author === req.use._id from session if so user is author
    const { id ,reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have the correct permissions')
        return res.redirect(`/campgrounds/${id}`)
    }
        next()

}

module.exports.validateReview = (req, res, next) => {
    //checks req.body against reviewschema aka joi
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(error.message, 400)
    } else {
        next()
    }
}
// module.exports.isCamp = async (req, res, next) => {
//     //if theres not a camp flash to local error var msg then redirect to campground
//     const { id } = req.params
//     const campground = await Campground.findById(id);
//     if(!campground) {
//         req.flash('error', 'Campground Not Fount')
//         res.redirect('/campgrounds')
//     }
// }
module.exports.isCamp = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);

    if(!campground) {
        req.flash('error', 'Campground Not Fount')
        return res.redirect('/campgrounds')
    }
    next()
}