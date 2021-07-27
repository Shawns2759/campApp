const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().min(1).max(150),
        price: Joi.number().required().min(1),
        description: Joi.string().required().min(1).max(500),
        image: Joi.string().required().min(1).max(150),
        location: Joi.string().required().min(1).max(50),
    }).required()
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().min(1).max(220)
    })
}).required()