const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user');
const passport = require('passport');
isAuthenticated: Boolean;
const authorize = require('../middleware/authorize')


router.post('/signup', async (req, res, next) => {
    try {
        console.log("here in signup API")
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        console.log(existingUser)

        if (existingUser) {
            console.log("please login")
            return res.status(400).json({ error: 'Your account already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username, email, password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ data: "User registered successfully" });
    }
    catch (error) {
        res.json(error);
    }
}
);




router.post('/verify', async (req, res, next) => {
    console.log("in verify");
    try {
        if (!req.body.captcha) {
            return res.json({ 'msg': 'captcha token is undefined' });
        }

        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const secretKey = '6LdRv94oAAAAALE7vn_vBRiD9rWPO6XHBif0VE5x'


        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', {
            secret: '6LdRv94oAAAAALE7vn_vBRiD9rWPO6XHBif0VE5x',
            response: req.body.captcha
        });
        console.log(response)
        const body = response.data;
        console.log("captcha captcha")
        console.log(body.success)
        if (!body.success || body.score < 0.4) {
            return res.json({ 'msg': 'You might be a robot, Sorry! You are banned!', 'score': body.score });
        }

        return res.json({ 'msg': 'You have been verified, You may proceed!', 'score': body.score });

    } catch (err) {
        console.error(err);
        res.json(err);
    }
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log("in login")
    console.log(req.session)
    try {
        // this.isAuthenticated = true;
        res.send.json({ ...req.user })

    } catch (err) {
        res.json(err)
    }
})

router.get('/logout', (req, res, next) => {
    console.log("in logout")
    try {
        console.log(req.session)
        req.session.destroy();
        console.log(req.session)
        this.isAuthenticated = false;
        console.log('session destroyed!')
    } catch (err) {
        res.json(err)
    }
})

router.get('/userid', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
}, (req, res, next) => {
    console.log("in user session")
    try {
        console.log(req.session.passport.user)
        res.send({ userid: req.session.passport.user })
    } catch (err) {
        res.json(err)
    }
})

router.get('/userrole/:id', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
}, async (req, res, next) => {
    console.log("in get role")
    try {
        const id = req.session.passport.user
        const existingUser = await User.findOne({
            _id: id
        });
        console.log(existingUser.role)
        // user = { ...existingUser }
        // console.log(req.session.passport.user)
        res.send({ role: existingUser.role })

        // res.send(req.session.passport.user)
    } catch (err) {
        // console.log("this error")
        res.json(err)

    }


    // console.log("in get role")
    // try {
    //     const existingUser = await User.findOne({
    //         _id
    //     });
    //     if (!existingUser) {
    //         return res.status(404).send()
    //     }
    //     res.send(existingUser)
    //     console.log(existingUser)
    // } catch (err) {
    //     res.json(err)
    // }
})

module.exports = router;