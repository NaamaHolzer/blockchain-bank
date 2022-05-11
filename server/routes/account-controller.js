const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const bcrypt = require('bcryptjs');
const User = require('../models')("User");
const checkAdmin = require('../middlewares/check-admin');
const fetch = require('node-fetch');

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
            console.log("got here ", balance)
            await User.UPDATE({
                username: findUser.username
            }, { approved: true, balance: balance, rate: await calcRate() });
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


module.exports = router;