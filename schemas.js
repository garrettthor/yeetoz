const Joi = require('joi');

module.exports.burritoValidateSchema = Joi.object({
    burrito: Joi.object({
        title: Joi.string().required(),
        restaurant: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

