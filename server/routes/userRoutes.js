const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/user/:username', async (req, res, next) => {
    const username = req.params.username
    // const theUser = await User.findOne({
    //     username
    // });
    User.findOne({ username }).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send(e)
    })
});

router.patch('/user/:username', async (req, res, next) => {
    console.log("in")
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ['username', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;