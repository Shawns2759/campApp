//returns func that accepts function then exicutes func and catches errors to send to next 
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}