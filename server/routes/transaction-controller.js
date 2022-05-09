const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const Transaction = require('../models')("Transaction");
const User = require('../models')("User");
const Loan = require('../models')("Loan");


router.get('/', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("Getting transactions")
        const transactions = await Transaction.REQUEST_TRANSACTIONS_RANGE(req.currentUser.username, req.body.range);
        console.log(transactions);
        res.status(200).json({ message: "Retrieved transactions successfully", transactions: transactions });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post('/', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("performing transaction")
        const fromUser = await User.REQUEST_ONE(req.currentUser.username);
        const toUser = await User.REQUEST_ONE(req.body.toUser);
        const newBalance = fromUser.balance - req.body.amount;
        if (newBalance >= 0) {
            await User.UPDATE({
                username: fromUser.username
            }, { balance: newBalance });

            await User.UPDATE({
                username: toUser.username
            }, { balance: toUser.balance + req.body.amount });
            const transaction = {
                from: fromUser.username,
                to: toUser.username,
                amount: req.body.amount,
                date: new Date()
            }
            await Transaction.CREATE(transaction);

            const userDebts = await Loan.REQUEST_USER_DEBTS(fromUser.username);
            userDebts.forEach(debt => {
                if (debt.amount > 0.6 * newBalance) {
                    //TODO: alert debt.fromUser
                    console.log("alerting ", debt.from);
                }
            });

            if (newBalance === 0) {
                console.log("toast manager balance is 0")
                    // TODO: toast
            }
            res.status(200).json({ message: "Transaction succeeded" });
        } else {
            //TODO: toast
            console.log("toast user balance is less than 0")
            res.status(200).json({ message: "Transaction failed" });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
module.exports = router;