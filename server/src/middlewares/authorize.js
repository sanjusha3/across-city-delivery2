// const authorize = (roles) => {
//   return async (req, res, next) => {
//     if (roles.includes("ADMIN")) {
//       await next();
//     } else {
//       res.status(403).json({ message: "Forbidden" });
//     }
//   };
// };
const User = require('../models/user');

const authorize = (inputrole) => async (req, res, next) => {
  User.findById(req.user).then((user) => {
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" })
    }
    role = user.role
    console.log(req.user + "user")
    console.log(user.role + "user")
    // console.log(role + "user")
    if (user.role !== inputrole) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  })
}
module.exports = authorize;
