//passport checks session to see if you are authenticated

const loggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    } 
    next()
}


module.exports = loggedIn