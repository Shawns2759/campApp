const Joi = require('joi')

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().min(1).max(150),
        price: Joi.number().required().min(1).max(50),
        description: Joi.string().required().min(1).max(500),
        image: Joi.string().required().min(1).max(150),
        location: Joi.string().required().min(1).max(50),
    }).required()
})

module.exports.campgroundSchema = campgroundSchema