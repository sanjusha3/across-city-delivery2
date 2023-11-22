const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Order = require('../models/order');

const authorize = require('../middleware/authorize')

router.get('/user/:id', authorize('USER'), async (req, res, next) => {
    const _id = req.params.id

    User.findById({ _id }).then((user) => {
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send({ id: user._id, username: user.username, email: user.email })
    }).catch((error) => {
        res.send(error)
    })
});

router.patch('/user/:id', authorize('USER'), async (req, res, next) => {
    console.log("in")
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ['username', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        if (req.body.username || req.body.email) {
            const usernameExists = await User.findOne({ username: req.body.username });
            const emailExists = await User.findOne({ email: req.body.email });
            if (usernameExists && emailExists) {
                return res.status(400).send('Please enter at least one unique value!');

            }
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send('User not found')
        }

        res.status(200).send({ id: user._id, username: user.username, email: user.email })
    } catch (error) {
        res.send(error)
    }
});

router.post('/user/order', authorize('USER'), async (req, res, next) => {
    try {
        console.log("here in create order API")
        const { itemName, itemWeight, pickupAddress, dropAddress } = req.body;

        const newOrder = new Order({
            itemName, itemWeight, pickupAddress, dropAddress,
        });
        console.log(newOrder)
        await newOrder.save();

        res.status(201).send({ 'message': 'Order Placed!' });
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;