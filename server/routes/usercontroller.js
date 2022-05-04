const express = require('express');
const router = express.Router();
const checksession = require('../middlewares/checksession');
const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}


router.post('/user/login',
    (req, res) => {
        console.log("In login post")
        var session = req.session;
        session.userId = req.user.id;
        session.admin = req.user.admin;
        session.userName = req.user.name;
        res.redirect('/');
    });

module.exports = router;