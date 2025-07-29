const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({ // 'image' should be an object
            url: Joi.string().allow("", null), // 'url' inside 'image' should be a string, and can be empty/null
            filename: Joi.string().allow("", null) // 'filename' inside 'image' should be a string, and can be empty/null
        }).optional() 
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})
