const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models')("User");
const bcrypt = require('bcryptjs');

router.post('/login',
    async(req, res) => {
        const findUser = await User.REQUEST_ONE(req.body.username);
        const verified = bcrypt.compareSync(req.body.password, findUser.password);
        if (verified) {
            const token = jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET);
            return res.cookie('token', token, {
                secure: false, // since we're not using https
                httpOnly: true,
            }).status(200).json({ message: "login successful" });

        } else {
            res.status(500).json({ message: "Username or password incorrect" });
        }
    });



module.exports = router;