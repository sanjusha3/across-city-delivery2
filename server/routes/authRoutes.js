const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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
            return res.status(400).json({ error: 'Your account already exists. Please login' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)

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

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log("in login")
    try {
        this.isAuthenticated = true;
        res.send.json({ ...req.user })
    } catch (err) {
        res.json(err)
    }
})

router.get('/logout', (req, res, next) => {
    console.log("in logout")
    try {
        req.session.destroy();
        this.isAuthenticated = false;
        console.log('session destroyed!')
    } catch (err) {
        res.json(err)
    }
})

module.exports = router;