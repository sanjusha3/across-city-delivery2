const isAuthenticated = require('./authRoutes');


router.get('/user', async (req, res, next) => {
    console.log("in get user")
    try {
        if (isAuthenticated) {
        };
    } catch (err) {
        res.json(err)
    }
})