const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')
const { campgroundSchema, reviewSchema } = require('../schemas')
const Campground = require('../models/campground')

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

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {campgrounds})
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save()
    req.flash('success','Succesfully made a new campground!' )
    res.redirect(`campgrounds/${newCamp.id}`)
}))
router.get('/:id',  catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id).populate('reviews')
    //if theres not a camp flash to local error var msg then redirect to campground
    if (!campground) {
        req.flash('error', 'Campground Not Fount')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', {campground})
}))
router.get('/:id/edit',  catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground Not Fount')
        res.redirect(`/campgrounds/`)
    }
    res.render('campgrounds/edit', {campground})
}))
router.put('/:id',  validateCampground,catchAsync(async (req, res) => {
    const { id } = req.params
    const {location, title, description, image, price} = req.body.campground
    const updatedCamp = await Campground.findByIdAndUpdate(id, {
        location: location,
        title: title,
        descriiption: description,
        image: image, 
        price: price
    }, { new: true })
    req.flash('success','Succesfully Edited Campground')
    res.redirect(`/campgrounds/${updatedCamp.id}`)
}))
router.delete('/:id',  catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted Campground')
    res.redirect(`/campgrounds`)
}))

module.exports = router