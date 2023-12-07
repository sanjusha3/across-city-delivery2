const User = require('../models/user')
const axios = require('axios');


exports.existingUser = async function (username, email){
    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.existingUsername = async function (username){
    try{
        const existingUsername = await User.findOne({username});
        return existingUsername;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.existingUserById = async function (id){
    try{
        const existingUser = await User.findById(id);
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.saveUser = async function (username, email, hashedPassword){
    try {
        const newUser = new User({
            username, email, password: hashedPassword,
        });
        console.log('created new user')

        await newUser.save()
        console.log('saved user')
    }
    catch (error){
        throw new Error('error saving user')
    }
}

exports.verifyUser = async function (key, captcha){
    try { 
        const response = axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${captcha}`)
        return response;
    }
    catch (error){
        throw new Error('error verifying user')
    }
}