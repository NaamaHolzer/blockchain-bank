const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const bcrypt = require('bcryptjs');
const User = require('../models')("User");
const checkAdmin = require('../middlewares/check-admin');
const fetch = require('node-fetch');
const nodemailer = require("nodemailer");
const keyGenerator = require('../blockchain/keygenerator');

router.post('/request',
    async(req, res) => {
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 10),
            email: req.body.email
        }
        const findUser = await User.REQUEST_ONE(newUser.username);
        if (findUser) {
            res.status(500).json({ message: "User already exists" });
            return;
        }
        try {
            await User.CREATE(newUser);
            sendEmail(req.body.username);
            res.status(200).json({ message: "Request sent successfully" });
        } catch (err) {
            res.json({ message: err });
        }
    });


router.post('/handleRequest', checkAdmin.verifyAdmin, async(req, res) => {
    const findUser = await User.REQUEST_ONE(req.body.username.toLowerCase());
    if (!findUser) {
        res.status(500).json({ message: "User does not exist" });
        return;
    }
    try {
        if (req.body.approved) {
            console.log("Updating request")
            const currency = req.body.currency;
            var balance = 0;
            if (currency === "LEV") {
                balance = parseFloat(req.body.balance);
            } else if (currency === "USD") {
                balance = parseFloat(req.body.balance) * calcRate();
            } else {
                try {
                    const usdBalance = parseFloat((await convertCurrency(req.body.balance, "ILS", "USD")).result);
                    const rate = await calcRate();
                    balance = usdBalance * rate;
                    console.log(balance);
                } catch (err) {
                    console.log(err);
                }
            }
            const keys = keyGenerator.getKeys();
            await User.UPDATE({
                username: findUser.username
            }, { approved: true, balance: balance, rate: await calcRate(), privateKey: keys.privateKey, publicKey: keys.publicKey });
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
        if(!req.isLoggedIn)
            return res.status(401).json('You need to login')
        await User.UPDATE({
            username: req.currentUser.username
        }, { firstName: req.body.firstName, lastName: req.body.lastName ,email:req.body.email});
        console.log("updated successfully")
        return res.status(200).json({ message: "Request updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

router.get('/balance', checkAuth.verifyToken, async(req, res) => {
    try {
        if(!req.isLoggedIn)
            res.status(401).json('You need to login')
        const user = await User.REQUEST_ONE(req.currentUser.username);
        if (req.body.currency === "LEV") {
            res.status(200).json({ message: "Balance retrieved successfully", balance: user.balance });
        } else if (req.body.currency === "USD") {
            res.status(200).json({ message: "Balance retrieved successfully", balance: user.balance / user.rate });
        } else {
            const ilsBalance = (await convertCurrency(user.balance / user.rate, "USD", "ILS")).result;
            res.status(200).json({ message: "Balance retrieved successfully", balance: ilsBalance });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get('/getUserDetails', checkAuth.verifyToken, async(req, res) => {
    try {
        const user = await User.REQUEST_ONE(req.currentUser.username);
        res.status(200).json({userDetails:{email:user.email,firstName:user.firstName,lastName:user.lastName}})
    } catch (err) {
        res.status(500).json({ message: err });
    }
});


async function calcRate() {
    const numUsers = ((await User.REQUEST()).filter(account => account.approved)).length;
    return 1 - 0.01 * numUsers;
}

async function convertCurrency(amount, fromCurrency, toCurrency) {

    console.log("in tousd")
    console.log(amount)
    console.log(fromCurrency)
    console.log(toCurrency)
    var myHeaders = new fetch.Headers();
    myHeaders.append("apikey", "Ijkym7cZLQyCC9JIy6Ac4tKbEoqCAgud");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    return fetch("https://api.apilayer.com/currency_data/convert?to=" +
            toCurrency + "&from=" + fromCurrency + "&amount=" + amount.toString(), requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}



function sendEmail(username) {

    let mailTransporter = nodemailer.createTransport({
        service: 'AOL',
        auth: {
            user: 'bankproject2022@aol.com',
            pass: 'bbnuxhgmwztfnhhj'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    let mailDetails = {
        from: 'bankproject2022@aol.com',
        to: process.env.ADMIN_EMAIL,
        subject: "New Sign-Up Request!",
        text: "Hi Admin, a new sign-up request from " + username + " needs your attention. Happy banking :)",
    };

    mailTransporter.sendMail(mailDetails, function(err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = router;