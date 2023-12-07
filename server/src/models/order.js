const mongoose = require('mongoose')

const Order = mongoose.model('Order', {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    itemWeight: {
        type: Number,
        required: true,

    },
    pickupAddress: {
        type: String,
        required: true

    },
    dropAddress: {
        type: String,
        required: true
    }
})


module.exports = Order