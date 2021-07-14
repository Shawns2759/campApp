const express = require('express');
const app = express();
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

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




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
//creates alias for query string to make a put request
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    console.log(campgrounds)
    res.render('campgrounds/index.ejs', {campgrounds})
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})
app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save()
    res.redirect(`campgrounds/${newCamp.id}`)
})
app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    console.log(campground)
    res.render('campgrounds/show.ejs', {campground})
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    console.log(campground)
    res.render('campgrounds/edit', {campground})
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    console.log(req.body.campground.location)
    const updatedCamp = await Campground.findByIdAndUpdate(id, {location : req.body.campground.location, title: req.body.campground.title},{new:true})
    res.redirect(`/campgrounds/${updatedCamp.id}`)
})
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
})
app.listen(3000, () => {
    console.log('success')
})