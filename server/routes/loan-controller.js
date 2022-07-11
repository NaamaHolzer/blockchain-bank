const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const Loan = require("../models")("Loan");
const User = require("../models")("User");
const BlockchainModel = require("../models")("Blockchain");

const { Blockchain, Action } = require("../blockchain/blockchain");

router.get("/userloans", checkAuth.verifyToken, async (req, res) => {
  try {
    console.log("Getting loans");
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const loans = await BlockchainModel.REQUEST_USER_BLOCKS(
      "loan",
      req.currentUser.publicKey
    );
    console.log(loans);
    res.status(200).json({
      message: "Retrieved loans successfully",
      loans: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    console.log("performing loan");
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const fromUser = await User.REQUEST_ONE(req.currentUser.username);
    const toUser = await User.REQUEST_ONE(req.body.toUser);
    if (!toUser || !toUser.approved) {
      console.log("toast toUser does not exist");
      res.status(200).json({ message: "Loan failed" });
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
        new Date(req.body.endDate),
        Date.now()
      );
      loan.signAction(fromUser.privateKey);

      const blockchain = new Blockchain(
        (await BlockchainModel.REQUEST("loan"))[0]
      );
      blockchain.addAction(loan);
      await BlockchainModel.UPDATE(
        { chainType: "loan" },
        {
          chain: blockchain.getChain(),
        }
      );
    } catch (err) {
      //TODO toast
      res.status(500).json({
        message: "You are not certified to perform this loan ",
        err,
      });
      return;
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

    const userDebts = await Blockchain.REQUEST_USER_BLOCKS(
      "loan",
      fromUser.publicKey
    );
    userDebts.forEach((debt) => {
      if (debt.amount > 0.6 * newBalance) {
        //TODO: toast debt.fromuser
        console.log("alerting ", debt.from);
      }
    });

    res.status(200).json({ message: "Loan succeeded" });
    return;
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
});

router.get("/", checkAuth.verifyToken, async (req, res) => {
  try {
    console.log("Getting loans");
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const loans = await BlockchainModel.REQUEST_BLOCKS_RANGE(
      "loan",
      req.currentUser.publicKey,
      req.body.range
    );
    res.status(200).json({
      message: "Retrieved loans successfully",
      loans: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
module.exports = router;
