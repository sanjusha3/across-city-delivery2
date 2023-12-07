const User = require('../models/user')

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
        const existingUser = await User.findOne(username);
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.existingEmail = async function (email){
    try {
        const existingUser = await User.findOne(email);
        return existingUser;
    }
    catch (error){
        console.error('Error checking existing user:', error);
        return null;
    }
}

exports.saveUser = async function (username, email, hashedPassword){
    try {
        const newUser = new User({
            username, email, password: hashedPassword,
        });
        console.log('created new user')

        await newUser.save()
        console.log('saved user')
    }
    catch (error){
        throw new Error('error saving user')
    }
}

exports.getUsers = async function (){
    try {
        const users = User.find({ "role": "USER" }).select('_id username email')
        return users;
    } catch (error){
        throw new Error('error in finding users!')
    }
}

exports.getUserById = async function(id){
    try{
        const user = User.findById(id)
        return user;
    }
    catch(error){ 
        throw new Error('error in finding user')
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

exports.deleteUser = async function(id){
    try{
        const user1 = await User.findByIdAndDelete(id)
        return user1;
    }
    catch(error){ 
        throw new Error('error in deleting user')
    }
}
