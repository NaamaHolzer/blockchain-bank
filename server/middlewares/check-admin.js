const jwt = require('jsonwebtoken');

module.exports.verifyAdmin = async function(req, res, next) {
    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.status(401).json('You need to login')
        }
        const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
        if (decrypt.admin) {
            next();
        } else {
            return res.status(401).json("You don't qualify to perform this action")
        }
    } catch (err) {
        return res.status(500).json(err.toString());
    }
}