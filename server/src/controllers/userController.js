const { validateGetById, validateOrder, validateUpdateUserDetails, validateUpdateOrderDetails } = require('../../validator/validator')
const User = require('../models/user')
const UserService = require('../services/userService')

exports.getUserById = async function(req,res,next){
    const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
    const _id = req.params.id
    try{
    const user = await UserService.getUserById(_id)
    // User.findById({ _id }).then((user) => {
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send({ id: user._id, username: user.username, email: user.email })
    }
    catch(error) {
        res.send(error)
    }
}

exports.getUserByIdAndUpdate = async function(req,res,next){
    const { error, value } = validateUpdateUserDetails(req.body);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
    console.log("in")
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ['username', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        const user = await UserService.getUserById(req.params.id)
        if (!user) {
            return res.status(404).send('User not found')
        }

        if (req.body.username || req.body.email) {
            const existingUsername = await UserService.existingUsername(req.body.username)
            const existingEmail = await UserService.existingEmail(req.body.email)

            console.log("dddddddddddddddddddddd",existingUsername,existingEmail);
            // const usernameExists = await User.findOne({ username: req.body.username });
            // const emailExists = await User.findOne({ email: req.body.email });
            if (existingUsername || existingEmail) {
                // console.log('usernameExists')
                return res.status(400).json('Please enter at least one unique value!');
                
            }
        }

        // res.status(200).send({ id: user._id, username: user.username, email: user.email })

        const updatedUser = await UserService.getUserByIdAndUpdate(req.params.id, req.body)
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        res.status(200).send({ id: updatedUser._id, username: updatedUser.username, email: updatedUser.email });
    } catch (error) {
        res.send(error)
    }
}

exports.createOrder = async function(req,res,next){
    try {
        const { error, value } = validateOrder(req.body);
        console.log(error)
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        console.log("here in create order API")
        console.log(req.body)
        console.log('need to find user here')
        console.log(req.session.passport.user);
        const userdetails = await UserService.getUserById(req.session.passport.user)
        // console.log(userdetails);
        const username = userdetails.username
        console.log(userdetails.username);

        const { itemName, itemWeight, pickupAddress, dropAddress } = req.body;
        // const user = req.passport.session.user;
        // console.log(user, "this is user")
        
        await UserService.saveOrder(username, itemName, itemWeight, pickupAddress, dropAddress)
        
        res.status(201).send({ 'message': 'Order Placed!' });
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.getOrders = async function(req,res,next){
    console.log(req.query)
        try {
            var orders = await UserService.getOrders()

                if (!orders) {
                    return res.status(404).send('Orders not found!')
                }
                console.log(orders)
                res.status(200).send(orders)
            }
        catch (error) {
            res.send(error);
        }
}

exports.getOrderById = async function(req,res,next){
    try {
        const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        const _id = req.params.id

        const order = AdminService.getOrderById(_id)
            if (!order) {
                return res.status(404).send('Order not found!')
            }
            res.status(200).send(order)
        
    } catch (error) {
        res.send(error)
    }
}
exports.getOrderByIdAndUpdate = async function(req,res,next){
    const { error, value } = validateUpdateOrderDetails(req.body);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
    const updates = Object.keys(req.body);
    const allowedUpdates = ['itemName', 'itemWeight', 'pickupAddress', 'dropAddress'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!');
    }
    
    try {
        const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        const order = await UserService.getOrderById(req.params.id)
        // const user = await User.findById(req.params.id);
        
        if (!order) {
            return res.status(404).send('Order not found!');
        }
        
        // if (req.body.username || req.body.email) {
        //     const existingUsername = await AdminService.existingUsername(req.body.username)
        //     const existingEmail = await AdminService.existingEmail(req.body.email)

        //     // const usernameExists = await User.findOne({ username: req.body.username });
        //     // const emailExists = await User.findOne({ email: req.body.email });
        //     if (existingUsername || existingEmail) {
        //         // console.log('usernameExists')
        //         return res.status(400).json('Please enter at least one unique value!');
                
        //     }
        // }
        const updatedOrder = await UserService.getOrderByIdAndUpdate(req.params.id, req.body)
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        res.status(200).send(updatedOrder);
    } catch (error) {
        res.send(error);
    }
}


exports.deleteOrder = async function(req,res,next){
    try {
        const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        const order1 = await UserService.deleteOrder(req.params.id)
        // const user = await User.findByIdAndDelete(req.params.id)
        
        if (!order1) {
            return res.status(404).send('Order not found!')
        }
        
        res.status(200).send(order1)
    } catch (error) {
        res.send(error)
    }
}