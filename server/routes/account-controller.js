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
            res.status(200).json({ message: "Request sent successfully" });
        } catch (err) {
            res.json({ message: err });
        }
    });


//Check if current user is admin
router.post('/handleRequest', checkAdmin.verifyAdmin, async(req, res) => {
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
            }, { approved: true, balance: req.body.balance });
        } else {
            await User.DELETE(findUser.username)
        }
        res.status(200).json({ message: "Request updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.put('/', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("Updating request")
        await User.UPDATE({
            username: req.currentUser.username
        }, { firstName: req.body.firstName, lastName: req.body.lastName });
        res.status(200).json({ message: "Request updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get('/balance', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("Getting account balance")
        const user = await User.REQUEST_ONE(req.currentUser.username);
        res.status(200).json({ message: "Request updated successfully", balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});


module.exports = router;