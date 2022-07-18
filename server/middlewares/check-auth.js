
const jwt = require('jsonwebtoken');
const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1438647",
    key: "ccaa990cbc0f5017da22",
    secret: "00fb676b56ff4d382692",
    cluster: "ap2",
    useTLS: true
  });
  
module.exports.verifyToken = async function(req, res, next) {
    // pusher.trigger("my-channel", "my-event", {
    //     message: "hello world"
    //   });
      
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

