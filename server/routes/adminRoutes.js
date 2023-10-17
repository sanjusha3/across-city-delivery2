const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');


router.post('/admin/user', async (req, res, next) => {
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

router.get('/admin/user', async (req, res, next) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
});

router.get('/admin/user/:id', async (req, res, next) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })
});

router.patch('/admin/user/:id', async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/admin/user/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }

});

module.exports = router;