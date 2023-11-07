const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user');
const passport = require('passport');
isAuthenticated: Boolean;


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
            return res.status(400).send('This account already exists. Please Login!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username, email, password: hashedPassword,
        });

        await newUser.save();

        res.status(201).send({ 'message': 'User registered successfully' });
    }
    catch (error) {
        res.send(error);
    }
}
);




router.post('/verify', async (req, res, next) => {
    console.log("in verify");
    try {
        if (!req.body.captcha) {
            return res.status(400).send('captcha token is undefined');
        }

        const secretKey = '6LcBUPwoAAAAALhdgkEezMaXkdI2lNrpRXabhCaI'


        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`)

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
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log("in login")
    console.log(req.session)
    try {
        res.status(200).send({ ...req.user })

    } catch (error) {
        res.status(500).send(error)
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
    } catch (error) {
        res.status(500).send(error)
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
        res.status(200).send({ userid: req.session.passport.user })
    } catch (error) {
        res.status(500).send(error)
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
        res.status(200).send({ role: existingUser.role })

    } catch (error) {
        res.status(500).send(error)
    }

})

module.exports = router;