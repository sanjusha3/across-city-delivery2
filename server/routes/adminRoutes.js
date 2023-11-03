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
            console.log("This is an existing user")
            return res.status(400).json({ error: 'This is an existing user' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)

        const newUser = new User({
            username, email, password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ data: "User created!" });
    }
    catch (error) {
        res.json(error);
    }
}
);
// , passport.authenticate('local', { session: false }), authorize(['ADMIN'])
router.get('/admin/user',
    authorize('ADMIN')
    , async (req, res, next) => {
        User.find({ "role": "USER" }).select('_id username email').then((users) => {
            // res.json({ message: 'Admin access granted' });
            // console.log(req.user.role.role)
            // console.log(req.user.role)
            res.send(users)
        }).catch((e) => {
            res.status(500).send()
        })
    });

router.get('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send({ id: user._id, username: user.username, email: user.email })
    }).catch((e) => {
        res.status(500).send()
    })
});

router.patch('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        console.log(req.body)
        console.log(req.body.username)
        console.log(req.body.email)
        if (!user) {
            return res.status(404).send();
        }

        if (req.body.username || req.body.email) {
            const usernameExists = await User.findOne({ username: req.body.username });
            const emailExists = await User.findOne({ email: req.body.email });
            if (usernameExists && emailExists) {
                // console.log('usernameExists')
                return res.status(400).json({ error: 'Please enter at least one unique value!' });

            }
        }



        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send({ id: updatedUser._id, username: updatedUser.username, email: updatedUser.email });
    } catch (error) {
        res.json(error);
    }
});

// router.patch('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['username', 'email', 'password']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {

//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send({ id: user._id, username: user.username, email: user.email })

//     } catch (error) {
//         res.status(400).send(error)
//     }
// });

router.delete('/admin/user/:id', authorize('ADMIN'), async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send({ id: user._id, username: user.username, email: user.email })
    } catch (e) {
        res.status(500).send()
    }

});

module.exports = router;