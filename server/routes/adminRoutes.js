const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');
const authorize = require('../middleware/authorize')

router.post('/admin/user', authorize('ADMIN'), async (req, res, next) => {
    try {
        console.log("here in create user API")
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        console.log(existingUser)

        if (existingUser) {
            return res.status(400).send('This is an existing user');
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username, email, password: hashedPassword,
        });

        await newUser.save();

        res.status(201).send({ 'message': 'User created!' });
    }
    catch (error) {
        res.send(error);
    }
}
);
router.get('/admin/user',
    authorize('ADMIN')
    , async (req, res, next) => {
        try {
            User.find({ "role": "USER" }).select('_id username email').then((users) => {

                if (!users) {
                    return res.status(404).send('Users not found!')
                }
                res.status(200).send(users)
            })
        }
        catch (error) {
            res.send(error);
        }

    });

router.get('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
    try {
        const _id = req.params.id

        User.findById(_id).then((user) => {
            if (!user) {
                return res.status(404).send('User not found!')
            }
            res.status(200).send({ id: user._id, username: user.username, email: user.email })
        })
    } catch (error) {
        res.send(error)
    }
});

router.patch('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!');
    }

    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        console.log(req.body)
        console.log(req.body.username)
        console.log(req.body.email)
        if (!user) {
            return res.status(404).send('User not found!');
        }

        if (req.body.username || req.body.email) {
            const usernameExists = await User.findOne({ username: req.body.username });
            const emailExists = await User.findOne({ email: req.body.email });
            if (usernameExists && emailExists) {
                // console.log('usernameExists')
                return res.status(400).json('Please enter at least one unique value!');

            }
        }



        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).send({ id: updatedUser._id, username: updatedUser.username, email: updatedUser.email });
    } catch (error) {
        res.send(error);
    }
});


router.delete('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send('User not found!')
        }

        res.status(200).send({ id: user._id, username: user.username, email: user.email })
    } catch (error) {
        res.send(error)
    }

});

module.exports = router;