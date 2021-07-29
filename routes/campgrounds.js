const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')
const campgrounds = require('../controllers/campgrounds')
const Campground = require('../models/campground')
const { loggedIn, isAuthor, validateCampground, isCamp} = require('../utils/middlewear')
const multer = require('multer')
const {storage} = require('../cloudinary/index.js')
//uploads to desired destination aka cloiudinary  
const upload = multer({ storage })

router.route('/')
    .get (catchAsync(campgrounds.index))
    //uploads single from req.file/image
    .post (loggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.newCampground))
    
router.get('/new', loggedIn, campgrounds.renderNew)

router.route('/:id')
.put( loggedIn, isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
.delete( loggedIn, isAuthor ,catchAsync(campgrounds.deleteCampground))
.get( isCamp, catchAsync(campgrounds.showCampground))






router.get('/:id/edit',  loggedIn, isAuthor ,catchAsync(campgrounds.renderEditForm))



module.exports = router