const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");
const Transaction = require("../models")("Transaction");
const User = require("../models")("User");
const BlockchainModel = require("../models")("Blockchain");
const Loan = require("../models")("Loan");
const { Blockchain, Action } = require("../blockchain/blockchain");

router.get("/usertransactions", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const transactions = await BlockchainModel.REQUEST_USER_BLOCKS(
      "transaction",
      req.currentUser.publicKey
    );
    res.status(200).json({
      message: "Retrieved transactions successfully",
      rows: transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/alltransactions", [checkAuth.verifyToken, checkAdmin.verifyAdmin], async (req, res) => {
    try {
      if (!req.isLoggedIn) {
        res.status(401).json("You need to login");
      }
      const transactions = await BlockchainModel.REQUEST_ALL(
        "transaction",
      );
      res.status(200).json({
        message: "Retrieved transactions successfully",
        rows: transactions,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

router.get("/range", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    console.log(req.query.range);
    const transactions = await BlockchainModel.REQUEST_BLOCKS_RANGE(
      "transaction",
      req.currentUser.publicKey,
      Number(req.query.range)
    );
    res.status(200).json({
      message: "Retrieved transactions successfully",
      rows: transactions,
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
      "transaction",
      Number(req.query.range)
    );
    res.status(200).json({
      message: "Retrieved transactions successfully",
      rows: transactions,
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
      res
        .status(401)
        .json({ message: "Transaction failed: to user does not exist" });
      return;
    }
    const newBalance = fromUser.balance - Number(req.body.amount);

    if (newBalance >= 0) {
      try {
        const transaction = new Action(
          fromUser.username,
          toUser.username,
          fromUser.publicKey,
          toUser.publicKey,
          Number(req.body.amount),
          new Date(2000, 1, 1),
          Date.now()
        );
        transaction.signAction(fromUser.privateKey);
        const blockchain = new Blockchain(
          (await BlockchainModel.REQUEST("transaction"))[0]
        );
        console.log("got here1");
        blockchain.addAction(transaction);
        console.log("got here2");
        await BlockchainModel.UPDATE(
          { chainType: "transaction" },
          {
            chain: blockchain.getChain(),
          }
        );
      } catch (err) {
        //TODO toast
        res.status(401).json({
          message: "You are not certified to perform this transaction ",
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
          //TODO: alert debt.fromUser
          // console.log("alerting ", debt.from);
        }
      });

      if (newBalance === 0) {
        // TODO: toast
      }
      res.status(200).json({ message: "Transaction succeeded" });
    } else {
      //TODO: toast
      res
        .status(401)
        .json({ message: "Transaction failed: user balance is less than 0" });
    }
  } catch (err) {
    throw err;
    // res.status(500).json({ message: err });
  }
});

router.post("/initializeChains", async (req, res) => {
  try {
    const loansChain = new Blockchain();
    const transactionsChain = new Blockchain();
    await BlockchainModel.CREATE("loan", loansChain.chain);
    await BlockchainModel.CREATE("transaction", transactionsChain.chain);
    res.status(200).json({ message: "Chains initialized" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
