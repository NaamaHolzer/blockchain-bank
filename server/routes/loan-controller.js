const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const Loan = require("../models")("Loan");
const User = require("../models")("User");

router.get("/", checkAuth.verifyToken, async (req, res) => {
  try {
    console.log("Getting loans");
    const loans = []; //await Blockchain.REQUEST_USER_BLOCKS("loan", req.currentUser.publicKey);

    res
      .status(200)
      .json({ message: "Retrieved loans successfully", loans: loans });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    console.log("performing loan");
    const fromUser = await User.REQUEST_ONE(req.currentUser.username);
    const toUser = await User.REQUEST_ONE(req.body.toUser);
    if (!toUser || !toUser.approved) {
      console.log("toast toUser does not exist");
      res.status(200).json({ message: "Transaction failed" });
      return;
    }
    const newBalance = fromUser.balance - req.body.amount;
    if (newBalance <= 0.5 * fromUser.balance) {
      //TODO: toast
      console.log("toast fromuser balance is not enough");
      res.status(200).json({ message: "Loan failed" });
      return;
    }
    if (toUser.balance * 0.6 < req.body.amount) {
      console.log("toast touser balance is not enough");
      res.status(200).json({ message: "Loan failed" });
      return;
    }

    try {
      const loan = new Action(
        fromUser.publicKey,
        toUser.publicKey,
        req.body.amount,
        req.body.endDate,
        Date.now()
      );
      loan.signAction(fromUser.privateKey);
      const blockchain = []; // new Blockchain(await BlockchainModel.REQUEST("loans"));
      blockchain.addAction(transaction);
      // await BlockchainModel.UPDATE({chainType: "loan", chain: blockchain.getChain()});
    } catch (err) {
      //TODO toast
      res.status(500).json({
        message: "You are not certified to perform this loan ",
        err,
      });
    }

    await User.UPDATE(
      {
        username: fromUser.username,
      },
      { balance: newBalance }
    );

    await User.UPDATE(
      {
        username: toUser.username,
      },
      { balance: toUser.balance + req.body.amount }
    );
    const loan = {
      from: fromUser.username,
      to: toUser.username,
      amount: req.body.amount,
      date: new Date(),
      endDate: req.body.endDate,
    };
    const userDebts = []; // await Blockchain.REQUEST_USER_BLOCKS("loan", fromUser.publicKey);
    userDebts.forEach((debt) => {
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
