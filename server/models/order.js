const mongoose = require('mongoose')
const validator = require('validator')

const Order = mongoose.model('Order', {
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