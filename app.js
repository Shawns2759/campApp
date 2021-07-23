const express = require('express');
const app = express();
const path = require('path')
// const Campground = require('./models/campground')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError.js')
const { campgroundSchema, reviewSchema } = require('./schemas')
const session = require('express-session')
const flash = require('connect-flash')
// const Review = require('./models/review')
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false

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
//serves static files from public
app.use(express.static(path.join(__dirname, 'public')) )
const sessionConfig = {
    secret: 'secret',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        //cookie settings expires in a week max age: week http only dosent allow css
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
//makes session and configs it to sessionConfig
app.use(session(sessionConfig))

app.use(flash())

app.use((req, res, next) => {
    //sets a local var in views sucess is === success thrown after new form completion check campground routes new 
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
//imports campgrounds router form campgrounds and prefixes it with '/campgrounds'
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

//if no routes match then throw expressErr
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