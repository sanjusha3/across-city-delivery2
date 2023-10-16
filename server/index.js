const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors')
require('./config/passport')
const User = require('./models/user')
const port = process.argv[2] || 3000
const app = express()
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/project')
    .then(() => {
        console.log("Connected to Database!")
    })
    .catch(() => {
        console.log("connection failed!")
    })


app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    maxAge: 60 * 60 * 24
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(passport.session());

app.get('/', (req, res, next) => {
    console.log(req.session);
})

app.use('', require('./routes/authRoutes'));

app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({ data: "null", error: err });
    }

    return res.status(500).json({ data: null, error: 'Internal Server Error' });
});


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})