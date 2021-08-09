if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


const express = require('express');
const app = express();
const path = require('path')
// const Campgro und = require('./models/campground')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError.js')
const { campgroundSchema, reviewSchema } = require('./schemas')
const session = require('express-session')
const flash = require('connect-flash')
const dbUrl = process.env.DB_URL
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoStore = require("connect-mongo")
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

// const Review = require('./models/review')

// routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false

// });
mongoose.connect(dbUrl, {
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const store = new MongoStore({
    url: dbUrl,
    secret: 'secret',
    touchAfter: 24 * 60 * 60
})

const sessionConfig = {
    name: 'sesh',
    secret: 'secret',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        //cookie settings expires in a week max age: week http only dosent allow css
        httpOnly: true,
        // secure: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
//makes session and configs it to sessionConfig
app.use(session(sessionConfig))


//setting up passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash())
app.use(helmet({contentSecurityPolicy: false}))


app.use((req, res, next) => {
    //sets a local var in views sucess is === success thrown after new form completion check campground routes new / gives all templetes acces 
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    console.log(req.session.returnTo, req.session)
    next()
})

//landing page route
app.get('/home', (req, res) => {
    res.render('home.ejs')
})
//imports campgrounds router form campgrounds and prefixes it with '/campgrounds'
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

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