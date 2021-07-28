const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')
const campgrounds = require('../controllers/campgrounds')
const Campground = require('../models/campground')
const { loggedIn, isAuthor, validateCampground, isCamp} = require('../utils/middlewear')

router.route('/')
    .get (catchAsync(campgrounds.index))
    .post (loggedIn, validateCampground, catchAsync(campgrounds.newCampground))


    router.get('/new', loggedIn, campgrounds.renderNewForm)

router.route(':id')
.put( loggedIn, isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
.delete( loggedIn, isAuthor ,catchAsync(campgrounds.deleteCampground))
.get( isCamp, catchAsync(campgrounds.showCampground))



router.get('/:id/edit',  loggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm))



module.exports = router