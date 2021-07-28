const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')

module.exports.getRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username })
        //register method from passport takes usename/email and password then salts pass
        const regUser = await User.register(newUser, password)
        //keeps user loged in/ if err then sends err to err handler
        req.login(regUser, err => {
            if (err) {
                return next(err)
            }
            req.flash('success','Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error', `${e.message}`)
        res.redirect('/register')
    }
}


module.exports.userLoginForm = (req, res) => {
    res.render('users/login')
}
module.exports.userAuthentication = (req, res) => {
    req.flash('success', 'welcome back!')
    //redirects to previous url before login was required 
    const redirectUrl = req.session.returnTo || '/campgrounds'
    console.log("returnTo"+req.session.returnTo)
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.userLogout = (req, res) => {
    //passport method logout kills session
    req.logout();
    req.flash('success', 'You have been sucessfully logged out!')
    res.redirect('/campgrounds')
}