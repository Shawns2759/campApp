const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')

const Campground = require('../models/campground')
const { loggedIn, isAuthor, validateCampground, isCamp} = require('../utils/middlewear')



router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {campgrounds})
})

router.get('/new', loggedIn,(req, res) => {
    res.render('campgrounds/new.ejs')
})
router.post('/', loggedIn,validateCampground, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    
    //associated campground author(ref user) with the user id saved in req by passport
    newCamp.author = req.user._id
    await newCamp.save()
    req.flash('success','Succesfully made a new campground!' )
    res.redirect(`campgrounds/${newCamp.id}`)
}))
router.get('/:id',catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews').populate('author')
    //makes sure there is a campground
    isCamp(campground)
    console.log(campground)
    res.render('campgrounds/show.ejs', {campground})
}))
router.get('/:id/edit',  loggedIn, isAuthor ,catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground Not Found')
        return res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/edit', {campground})
    }
}))
router.put('/:id', loggedIn, isAuthor,validateCampground,catchAsync(async (req, res) => {
    const { id } = req.params
    const { location, title, description, image, price } = req.body.campground
        const updatedCamp = await Campground.findByIdAndUpdate(id, {
            location: location,
            title: title,
            description: description,
            image: image, 
            price: price
        }, { new: true })
        req.flash('success','Succesfully Edited Campground')
        res.redirect(`/campgrounds/${updatedCamp.id}`)
}))
router.delete('/:id', loggedIn, isAuthor ,catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted Campground')
    res.redirect(`/campgrounds`)
}))

module.exports = router