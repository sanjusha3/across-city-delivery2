const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};



const verifyCallback = (username, password, done) => {
    User.findOne({ username: username })
        .then(async (user) => {
            if (!user) {
                return done("User not found!")
            }

            const isValid = await bcrypt.compare(password, user.password);
            console.log(isValid, user)
            if (isValid) {
                console.log("user validated")
                return done(null, user);
            } else {
                console.log("invalid password")
                return done("Invalid password", false);
            }
        }).catch((err) => {
            console.log("error1", err)
            return done(err, false);
        });
}

const local = new LocalStrategy(customFields, verifyCallback);

passport.use(local);

passport.serializeUser((user, done) => {
    console.log("serializer")
    done(null, user.id);
});

passport.deserializeUser(async (user, done) => {
    // console.log("deserializer")
    try {
        // const user = await User.findOne(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.user) return next();
}

module.exports = isAuthenticated