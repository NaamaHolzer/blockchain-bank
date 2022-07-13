// const jwt = require("jsonwebtoken");

// module.exports.verifyToken = async function (req, res, next) {
//   const token = req.cookies.token || "";
//   try {
//     if (!token) {
//         console.log("in middleware")
//       req.isLoggedIn = false;
//     } else {
//         console.log("logging in")
//       const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
//       req.isLoggedIn = true;
//       req.currentUser = {
//         username: decrypt.username,
//         publicKey: decrypt.publicKey,
//         admin: decrypt.admin,
//       };
//     }
//     next();
//   } catch (err) {
//     return res.status(500).json(err.toString());
//   }
// };

const jwt = require('jsonwebtoken');

module.exports.verifyToken = async function(req, res, next) {
    console.log('in check auth')
    const token = req.cookies.token || '';
    console.log(req.cookies);
    try {
        if (!token) {
            return res.status(401).json('You need to login')
        }
        const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.currentUser = {
            username: decrypt.username,
            publicKey: decrypt.publicKey,
            admin: decrypt.admin
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
}

