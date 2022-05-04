const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const bcrypt = require('bcryptjs');
const User = require('../models')("User");

router.post('/request',
    async(req, res) => {
        console.log("In request post", req.body)
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        }
        const findUser = await User.REQUEST_ONE(newUser.username);
        if (findUser) {
            console.log("In if")
            res.status(500).json({ message: "User already exists" });
            return;
        }
        try {
            await User.CREATE(newUser);
            res.status(204)
        } catch (err) {
            res.json({ message: err });
        }
    });


//Check if current user is admin
router.post('/open',
async(req, res) => {
console.log("In open post", req.body)
const findUser = await User.REQUEST_ONE(newUser.username);
if (!findUser) {
    res.status(500).json({ message: "User does not exist" });
    return;
}
try {
    if (req.body.approved) {
        await User.UPDATE({
            username: findUser.username
        }, { approved: true });
    } else {
        await User.DELETE(findUser.username)
    }
    res.status(204)
} catch (err) {}
res.json({ message: err });
}
}
});)


module.exports = router;