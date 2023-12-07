const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors')
require('./src/config/passport')
const User = require('./src/models/user')
const Order = require('./src/models/order')
const port = process.argv[2] || 3000
const app = express()
app.use(cors({
    origin: true,
    credentials: true,
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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
    cookie: { secure: false, maxAge: 60 * 60 * 24 * 1000, httpOnly: false },
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next) => {
    console.log(req.session);
})

app.use('', require('./src/routes/authRoutes'));
app.use('', require('./src/routes/adminRoutes'));
app.use('', require('./src/routes/userRoutes'));


app.use((err, req, res, next) => {
    if (err) {
        console.log(err)
        return res.status(400).json({ data: null, error: err });
    }

    return res.status(500).json({ data: null, error: 'Internal Server Error' });
});


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})