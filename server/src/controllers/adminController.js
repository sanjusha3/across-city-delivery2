const AdminService = require('../services/adminService')
const { validateSignup, validateGetById, validateUpdateUserDetails } = require('../../validator/validator')
const bcrypt = require('bcrypt');

exports.createUser = async function(req,res,next){
    try {
        const { error, value } = validateSignup(req.body);
        if (error) {
            console.log(error.details)
            console.log(error.details[0].message)
            console.log(error.details[0].path)
            const errorfield = error.details[0].path
            // return res.send(error.details);
            // if(error.details.message)
            if (errorfield.length === 1 && errorfield[0] === 'email') {
                return res.status(400).send('Please enter valid email address!');
              }
        }
        console.log("here in create user API")
        const { username, email, password } = req.body;
        const existingUser = await AdminService.existingUser(username,email)
        console.log(existingUser)
        
        if (existingUser) {
            return res.status(400).send('This is an existing user');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await AdminService.saveUser(username, email, hashedPassword);
        
        // await newUser.save();
        console.log('user saved');
        
        res.status(201).send({ 'message': 'User created!' });
    }
    catch (error) {
        next(error);
    }
}


exports.getUsers = async function(req,res,next){
    console.log(req.query)
        try {
            var users = await AdminService.getUsers()

                if (!users) {
                    return res.status(404).send('Users not found!')
                }
                console.log(users)
                res.status(200).send(users)
            }
        catch (error) {
            res.send(error);
        }
}


exports.getUserById = async function(req,res,next){
    try {
        const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
        const _id = req.params.id

        const user = AdminService.getUserById(_id)
            if (!user) {
                return res.status(404).send('User not found!')
            }
            res.status(200).send({ id: user._id, username: user.username, email: user.email })
        
    } catch (error) {
        res.send(error)
    }
}
exports.getUserByIdAndUpdate = async function(req,res,next){
    const { error, value } = validateUpdateUserDetails(req.body);
        if (error) {
            console.log(error.details)
            return res.send(error.details);
        }
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email'];
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
        const user = await AdminService.getUserById(req.params.id)
        // const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send('User not found!');
        }
        
        if (req.body.username || req.body.email) {
            const existingUsername = await AdminService.existingUsername(req.body.username)
            const existingEmail = await AdminService.existingEmail(req.body.email)

            // const usernameExists = await User.findOne({ username: req.body.username });
            // const emailExists = await User.findOne({ email: req.body.email });
            if (existingUsername || existingEmail) {
                // console.log('usernameExists')
                return res.status(400).json('Please enter at least one unique value!');
                
            }
        }
        const updatedUser = await AdminService.getUserByIdAndUpdate(req.params.id, req.body)
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        res.status(200).send({ id: updatedUser._id, username: updatedUser.username, email: updatedUser.email });
    } catch (error) {
        res.send(error);
    }
}


exports.deleteUser = async function(req,res,next){
    try {
        const { error, value } = validateGetById(req.params.id);
        if (error) {
            console.log(error.details)
            // return res.send(error.details);
            return res.status(400).send('Please provide valid Id!')
        }
        const user1 = await AdminService.deleteUser(req.params.id)
        // const user = await User.findByIdAndDelete(req.params.id)
        
        if (!user1) {
            return res.status(404).send('User not found!')
        }
        
        res.status(200).send({ id: user1._id, username: user1.username, email: user1.email })
    } catch (error) {
        res.send(error)
    }
}