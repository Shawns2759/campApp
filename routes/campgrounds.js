const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')
const campgrounds = require('../controllers/campgrounds')
const Campground = require('../models/campground')
const { loggedIn, isAuthor, validateCampground, isCamp} = require('../utils/middlewear')
const multer = require('multer')
//uploads to desired destination  
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .get (catchAsync(campgrounds.index))
    // .post (loggedIn, validateCampground, catchAsync(campgrounds.newCampground))
    //uploads single from req.file/image
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.redirect('/campgrounds/new')
    })
    
router.get('/new', loggedIn, campgrounds.renderNew)

router.route('/:id')
.put( loggedIn, isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
.delete( loggedIn, isAuthor ,catchAsync(campgrounds.deleteCampground))
.get( isCamp, catchAsync(campgrounds.showCampground))






router.get('/:id/edit',  loggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm))



module.exports = router