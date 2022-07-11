const jwt = require('jsonwebtoken');

module.exports.verifyToken = async function(req, res, next) {
    const token = req.cookies.token || '';
    try {
        if (!token) {
            //return res.status(401).json('You need to login')
            req.isLoggedIn = false;
            next();
        }
        const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.isLoggedIn = true;
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