const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const bcrypt = require('bcryptjs');
const User = require('../models')("User");
const checkAdmin = require('../middlewares/check-admin');

router.post('/request',
    async(req, res) => {
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 10)
        }
        const findUser = await User.REQUEST_ONE(newUser.username);
        if (findUser) {
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
router.post('/handleRequest', checkAdmin, async(req, res) => {
    const findUser = await User.REQUEST_ONE(req.body.username.toLowerCase());
    if (!findUser) {
        res.status(500).json({ message: "User does not exist" });
        return;
    }
    try {
        if (req.body.approved) {
            console.log("Updating request")
            await User.UPDATE({
                username: findUser.username
            }, { approved: true, amount: req.body.amount });
        } else {
            await User.DELETE(findUser.username)
        }
        res.status(204).json({ message: "Request updated successfully" })
    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;