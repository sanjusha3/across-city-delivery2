const User = require('../models/user')
const Order = require('../models/order')

exports.getUserById = async function(_id) {
    try{
        const user = User.findById({ _id })
        return user;
    }
    catch(error){
        throw new Error('error in finding user')
    }
}

exports.existingUser = async function (username, email){
    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.existingUsername = async function (username){
    try {
        const existingUser = await User.findOne({username});
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.existingEmail = async function (email){
    try {
        const existingUser = await User.findOne({email});
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.getUserByIdAndUpdate = async function(id, body){
    try{ 
        const updatedUser = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        console.log(updatedUser)
        return updatedUser;
    }
    catch(error){ 
        throw new Error('error in finding and updating user')
    }
}

exports.saveOrder = async function (user, itemName, itemWeight, pickupAddress, dropAddress){
    try {

        const newOrder = new Order({
            username:user, itemName, itemWeight, pickupAddress, dropAddress,
        });
        console.log(newOrder)
        console.log('created order');
        await newOrder.save();
        
        console.log('saved order')
    }
    catch (error){
        throw new Error('error creating order')
    }
}


exports.getOrders = async function (){
    try {
        const orders = await Order.find({ username: "Sanjusha Nagwani" }).select('itemName itemWeight pickupAddress dropAddress')
        console.log('in get orders!');
        console.log(orders);
        return orders;
    } catch (error){
        throw new Error('error in finding orders!')
    }
}

exports.getOrderById = async function(id){
    try{
        const order = Order.findById(id)
        return order;
    }
    catch(error){ 
        throw new Error('error in finding order')
    }
}

exports.getOrderByIdAndUpdate = async function(id, body){
    try{ 
        const updatedOrder = await Order.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        console.log(updatedOrder)
        return updatedOrder;
    }
    catch(error){ 
        throw new Error('error in finding and updating order')
    }
}

exports.deleteOrder = async function(id){
    try{
        const order1 = await Order.findByIdAndDelete(id)
        return order1;
    }
    catch(error){ 
        throw new Error('error in deleting order')
    }
}

