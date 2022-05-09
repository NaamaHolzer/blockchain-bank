const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const Loan = require('../models')("Loan");
const User = require('../models')("User");


router.get('/', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("Getting loans")
        const loans = await Loan.REQUEST_USER_LOANS(req.currentUser.username);

        res.status(200).json({ message: "Retrieved loans successfully", loans: loans });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post('/', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("performing loan")
        const fromUser = await User.REQUEST_ONE(req.currentUser.username);
        const toUser = await User.REQUEST_ONE(req.body.toUser);
        const newBalance = fromUser.balance - req.body.amount;
        if (newBalance <= 0.5 * fromUser.balance) {
            //TODO: toast
            console.log("toast fromuser balance is not enough")
            res.status(200).json({ message: "Loan failed" });
            return;
        }
        if (toUser.balance * 0.6 < req.body.amount) {
            console.log("toast touser balance is not enough")
            res.status(200).json({ message: "Loan failed" });
            return;
        }

        await User.UPDATE({
            username: fromUser.username
        }, { balance: newBalance });

        await User.UPDATE({
            username: toUser.username
        }, { balance: toUser.balance + req.body.amount });
        const loan = {
            from: fromUser.username,
            to: toUser.username,
            amount: req.body.amount,
            date: new Date(),
            endDate: req.body.endDate
        }
        await Loan.CREATE(loan);
        const userDebts = await Loan.REQUEST_USER_DEBTS(fromUser.username);
        userDebts.forEach(debt => {
            if (debt.amount > 0.6 * newBalance) {
                //TODO: toast debt.fromuser
                console.log("alerting ", debt.from);
            }
        });

        res.status(200).json({ message: "Loan succeeded" });

    } catch (err) {
        res.status(500).json({ message: err });
    }
});
module.exports = router;