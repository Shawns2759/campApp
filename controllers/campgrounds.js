const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {campgrounds})
}

module.exports.newCampground = async (req, res, next) => {
    const { id } = req.body
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
       

    // if (geoData) {
        const newCamp = new Campground(req.body.campground);
        //sets geometry field to data brought back from mapbox, access by grometry.coordiates
    if (!geoData.body.features[0]) {
            req.flash('error', 'Location not found. Try again using a different Location')
            return res.redirect('/campgrounds/new')
        }
        newCamp.geometry = geoData.body.features[0].geometry
        
        console.log(req.images)
            //breaks down files object and [uts url and filename into array ]
            newCamp.images = req.files.map(f =>({url: f.path, filename: f.filename}))
        //associated campground author(ref user) with the user id saved in req by passport
        newCamp.author = req.user._id
        await newCamp.save()
        console.log(newCamp ,newCamp.images)
        req.flash('success','Succesfully made a new campground!' )
        return res.redirect(`campgrounds/${newCamp.id}`)
    // } else {
    //     res.flash('error', 'Location not found. Try again using a different Location')
    //     return res.redirect('/login')
    // }
}
module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new.ejs')
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    
    //find campground then populate reviews then on each review populate the review-author //then populate one author of campground
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
 
    console.log(campground.images)
    res.render('campgrounds/show.ejs', {campground})
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    console.log(campground.images + 'THUMBNAILLLLL')

    if (!campground) {
        req.flash('error', 'Campground Not Found')
        return res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/edit', {campground})
    }
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const { location, title, description, image, price } = req.body.campground
        const updatedCamp = await Campground.findByIdAndUpdate(id, {
            location: location,
            title: title,
            description: description,
            image: image, 
            price: price
        }, { new: true })
     //breaks down files object and [uts url and filename into array ]
    const images = (req.files.map(f => ({ url: f.path, filename: f.filename })))
    //passes data from images arr and pases it into campground.images
    updatedCamp.images.push(...images)
    if (req.body.deleteImages) {
        // if there are filepaths in deleteimages loop through them and destroy them 
        for (let filename of req.body.deleteImages) {
            console.log(filename + 'DESTROY FILENAME')
            await cloudinary.uploader.destroy(filename)
            console.log(filename  + 'AFTERRRRRRR')
        }
        //if there are images to be deleted, pull from images array where the filename is in req.body.deleteImages array
        await updatedCamp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    await updatedCamp.save()
        console.log(updatedCamp)
        req.flash('success','Succesfully Edited Campground')
        res.redirect(`/campgrounds/${updatedCamp.id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted Campground')
    res.redirect(`/campgrounds`)
}