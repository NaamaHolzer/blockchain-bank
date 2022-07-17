const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");
const Loan = require("../models")("Loan");
const User = require("../models")("User");
const BlockchainModel = require("../models")("Blockchain");

const { Blockchain, Action } = require("../blockchain/blockchain");

router.get("/userloans", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const loans = await BlockchainModel.REQUEST_USER_BLOCKS(
      "loan",
      req.currentUser.publicKey
    );
    res.status(200).json({
      message: "Retrieved loans successfully",
      rows: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/allloans", [checkAuth.verifyToken, checkAdmin.verifyAdmin], async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const loans = await BlockchainModel.REQUEST_ALL(
      "loan"
    );
    res.status(200).json({
      message: "Retrieved loans successfully",
      rows: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const fromUser = await User.REQUEST_ONE(req.currentUser.username);
    const toUser = await User.REQUEST_ONE(req.body.toUser.toLowerCase());
    if (!toUser || !toUser.approved) {
      res.status(401).json({ message: "Loan failed: to user does not exist" });
      return;
    }
    const newBalance = fromUser.balance - Number(req.body.amount);
    if (newBalance <= 0.5 * fromUser.balance) {
      //TODO: toast
      res
        .status(401)
        .json({ message: "Loan failed: from user balance is not enough" });
      return;
    }
    if (toUser.balance * 0.6 < Number(req.body.amount)) {
      res
        .status(401)
        .json({ message: "Loan failed: to user balance is not enough" });
      return;
    }

    try {
      const loan = new Action(
        fromUser.username,
        toUser.username,
        fromUser.publicKey,
        toUser.publicKey,
        Number(req.body.amount),
        new Date(req.body.endDate),
        new Date(Date.now())
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
      res.status(401).json({
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
      { balance: toUser.balance + Number(req.body.amount) }
    );

    const userDebts = await BlockchainModel.REQUEST_USER_BLOCKS(
      "loan",
      fromUser.publicKey
    );
    userDebts.forEach((debt) => {
      if (debt.amount > 0.6 * newBalance) {
        //TODO: toast debt.fromuser
      }
    });

    res.status(200).json({ message: "Loan succeeded" });
    return;
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
});

router.get("/range", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const loans = await BlockchainModel.REQUEST_BLOCKS_RANGE(
      "loan",
      req.currentUser.publicKey,
      Number(req.query.range)
    );
    res.status(200).json({
      message: "Retrieved loans successfully",
      rows: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/adminrange", [checkAuth.verifyToken, checkAdmin.verifyAdmin], async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const transactions = await BlockchainModel.REQUEST_ALL_BLOCKS_RANGE(
      "loan",
      Number(req.query.range)
    );
    res.status(200).json({
      message: "Retrieved loans successfully",
      rows: transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
