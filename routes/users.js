const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/user')


router.route('/register')
    .get (users.getRegisterForm)
    .post (catchAsync(users.registerUser))

router.route('/login')
    .get(users.userLoginForm)
    //checks sesh to make sure your logged in if not flashises you back to /login else sends you to campgrounds with a sucess msg
    .post( passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.userAuthentication)

router.get('/logout', users.userLogout)

module.exports = router