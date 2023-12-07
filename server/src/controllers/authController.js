const User = require('../models/user')
const AuthService = require('../services/authService')
const bcrypt = require('bcrypt');
// const passport = require('passport');
const { validateSignup, validateLogin, validateCaptcha, validateSessionUser} = require('../../validator/validator')
// const axios = require('axios');


exports.createUser = async function(req,res,next){
    try {
        const { error, value } = validateSignup(req.body);
        console.log(error)
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        console.log("here in signup API")
        const { username, email, password } = req.body;
        const existingUser = await AuthService.existingUser(username,email)

        if (existingUser) {
            console.log("please login")
            return res.status(400).send('This account already exists. Please Login!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        await AuthService.saveUser(username, email, hashedPassword);
        
        // await newUser.save();
        console.log('user saved');

        res.status(201).send({ 'message': 'User registered successfully' });
    }
    catch (error) {
        res.send(error);
    }
}

exports.verifyUser = async function(req,res,next){
    try {
        const { error, value } = validateCaptcha(req.body.captcha);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        if (!req.body.captcha) {
            return res.status(400).send('captcha token is undefined');
        }

        const secretKey = '6LcBUPwoAAAAALhdgkEezMaXkdI2lNrpRXabhCaI'


        const response = await AuthService.verifyUser(secretKey, req.body.captcha);

        console.log(response)
        const body = response.data;
        console.log("captcha captcha")
        console.log(body.success)
        console.log(body.score)
        if (!body.success || body.score < 0.4) {
            return res.status(400).send('You might be a robot, Sorry! You are banned!');
        }

        res.status(200).send({ 'message': 'You have been verified, You may proceed!', 'score': body.score });

    } catch (error) {
        res.send(error);
    }
}

exports.ExistingUsername = async function(req,res,next){
    console.log('checking if user exists!')
    const existingUsername = await AuthService.existingUsername(req.body.username)
    console.log(existingUsername)
    if(!existingUsername){
        return res.status(400).send('This user doesnt exist! Please register!')
    }
    next();
}

exports.ValidateLogin = async function(req,res,next){
    console.log("login user", req.body);
    const { error, value } = validateLogin(req.body);
    console.log(error, value)
    if (error) {
        console.log('login not validated')
        console.log(error.details);
        console.log(error.details.message);
        return res.status(400).send('Please enter valid credentials!')
        // return res.send(error.details.message);
    }
    console.log("75");
    next();
}


exports.loginUser = async function(req,res,next){
    console.log("in login")
    // console.log(req.session)
    try {
        const { error, value } = validateSessionUser(req.session.passport.user);
        console.log(error, value)
        if (error) {
            console.log(error.details);
            return res.send(error.details);
        }
        console.log(req.user)
        console.log(req.session);
        res.status(200).send({ ...req.user })

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.logoutUser = async function(req,res,next){
    console.log("in logout")
    try {
        // const { error, value } = validateSessionUser(req.session.passport.user);
        // console.log(error, value)
        // if (error) {
        //     console.log(error.details);
        //     return res.send(error.details);
        // }
        console.log(req.session)
        req.session.destroy();
        console.log(req.session)
        this.isAuthenticated = false;
        console.log('session destroyed!')
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.checkAuthenticated = async function(req,res,next){
    if (req.isAuthenticated()) {
        return next()
    }
}

exports.getUserId = async function(req,res,next){
    console.log("in user session")
    try {
        const { error, value } = validateSessionUser(req.session.passport.user);
        console.log(error, value)
        if (error) {
            console.log(error.details);
            return res.send(error.details);
        }
        console.log(req.session.passport.user)
        res.status(200).send({ userid: req.session.passport.user })
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getUserRole = async function(req,res,next){
    console.log("in get role")
    try {
        const { error, value } = validateSessionUser(req.session.passport.user);
        console.log(error, value)
        if (error) {
            console.log(error.details);
            return res.send(error.details);
        }
        const id = req.session.passport.user
        const existingUser = await AuthService.existingUserById(id)
        console.log(existingUser.role)
        res.status(200).send({ role: existingUser.role })

    } catch (error) {
        res.status(500).send(error)
    }
}