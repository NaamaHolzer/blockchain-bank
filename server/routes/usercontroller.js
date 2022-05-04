const express = require('express');
const router = express.Router();
const checksession = require('../middlewares/checksession');

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