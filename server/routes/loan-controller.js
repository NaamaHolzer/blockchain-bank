const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const Loan = require('../models')("Loan");

router.get('/', checkAuth.verifyToken, async(req, res) => {
    try {
        console.log("Getting loans")
        const loans = await Loan.REQUEST_USER_LOANS(req.currentUser.username);
        res.status(200).json({ message: "Retrieved loans successfully", loans: loans });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

module.exports = router;