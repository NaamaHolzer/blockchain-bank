
const jwt = require('jsonwebtoken');

module.exports.verifyToken = async function(req, res, next) {
    const token = req.cookies.token || '';
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
        req.isLoggedIn = true
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
}

