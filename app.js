const express = require('express');
const app = express();
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError.js')
const { campgroundSchema, reviewSchema } = require('./schemas')
const Review = require('./models/review')

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



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
//creates alias for query string to make a put request
app.use(methodOverride('_method'))

//mongoose validation middlewear
const validateCampground = (req, res, next) => {
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
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(error.message, 400)
    } else {
        next()
    }
}

//routes

app.get('/', (req, res) => {
    res.render('/home')
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {campgrounds})
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})
app.post('/campgrounds', validateCampground,catchAsync(async (req, res, next) => {
        const newCamp = new Campground(req.body.campground);
        console.log(req.body.campground)
        await newCamp.save()
        res.redirect(`campgrounds/${newCamp.id}`)
}))
app.get('/campgrounds/:id',  catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show.ejs', {campground})
}))
app.get('/campgrounds/:id/edit',  catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}))
app.put('/campgrounds/:id',  validateCampground,catchAsync(async (req, res) => {
    const { id } = req.params
    const {location, title, description, image, price} = req.body.campground
    const updatedCamp = await Campground.findByIdAndUpdate(id, {
        location: location,
        title: title,
        descriiption: description,
        image: image, 
        price: price
    },{new:true})
    res.redirect(`/campgrounds/${updatedCamp.id}`)
}))
app.delete('/campgrounds/:id',  catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
}))
app.post('/campgrounds/:id/reviews', validateReview ,catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    console.log(req.body.review)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => { 
    const { id, reviewId } = req.params
    //finds camp by id and pulls every instance of reviewID out of reviews arr
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    const review = await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found 404', 404))
})


//error handling middlewear
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong' } = err
    if (!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
    console.log('success')
})