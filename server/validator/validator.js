const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });



const signupSchema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@])'))
        .min(9).required()
})
// const { error, value } = validator(signupSchema)(inout)

const loginSchema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@])'))
        .min(9).required()
})

exports.validateSignup = validator(signupSchema);
exports.validateLogin = validator(loginSchema);

