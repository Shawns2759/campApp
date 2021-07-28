const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', {campgrounds})
}

module.exports.newCampground = async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    //associated campground author(ref user) with the user id saved in req by passport
    newCamp.author = req.user._id
    await newCamp.save()
    req.flash('success','Succesfully made a new campground!' )
    res.redirect(`campgrounds/${newCamp.id}`)
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
    res.render('campgrounds/show.ejs', {campground})
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
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