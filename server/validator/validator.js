const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@])'))
        .min(9).required()
})

const loginSchema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@])'))
        .min(9).required()
})

const orderSchema = Joi.object({
    itemName: Joi.string().min(4).required(),
    itemWeight: Joi.number().required(),
    pickupAddress: Joi.string().required(),
    dropAddress: Joi.string().required()
})

const getByIdSchema = Joi.string().required()

const updateUserDetailsSchema = Joi.object({
    username: Joi.string().min(5).max(20),
    email: Joi.string().email()
})

const updateOrderDetailsSchema = Joi.object({
    itemName: Joi.string().min(4).required(),
    itemWeight: Joi.number().required(),
    pickupAddress: Joi.string().required(),
    dropAddress: Joi.string().required()
})

const captchaSchema = Joi.string().required()

const sessionUserSchema = Joi.string().required()

exports.validateSignup = validator(signupSchema);
exports.validateLogin = validator(loginSchema);
exports.validateOrder = validator(orderSchema);
exports.validateGetById = validator(getByIdSchema);
exports.validateUpdateUserDetails = validator(updateUserDetailsSchema);
exports.validateUpdateOrderDetails = validator(updateOrderDetailsSchema);
exports.validateCaptcha = validator(captchaSchema);
exports.validateSessionUser = validator(sessionUserSchema);
