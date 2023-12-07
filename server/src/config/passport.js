const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {
    console.log("passport");
    User.findOne({ username: username })
        .then(async (user) => {
            if (!user) {
                return res.status(400).send('This user doesnt exist! Please register!');
                // return done("User not found!")
            }
            console.log("in passport user local strategy");
            const isValid = await bcrypt.compare(password, user.password);
            console.log(isValid, user)
            if (isValid) {
                console.log("user validated")
                return done(null, user);
            } else {
                console.log("invalid password")
                return done("Invalid password", false);
            }
        }).catch((error) => {
            console.log("error1", error)
            res.send(error)
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