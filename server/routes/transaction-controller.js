const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");
const Transaction = require("../models")("Transaction");
const User = require("../models")("User");
const BlockchainModel = require("../models")("Blockchain");
const Loan = require("../models")("Loan");
const { Blockchain, Action } = require("../blockchain/blockchain");

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1438647",
  key: "ccaa990cbc0f5017da22",
  secret: "00fb676b56ff4d382692",
  cluster: "ap2",
  useTLS: true
});

router.get("/usertransactions", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("YOU NEED TO LOG IN");
    }
    const transactions = await BlockchainModel.REQUEST_USER_BLOCKS(
      "transaction",
      req.currentUser.publicKey
    );
    res.status(200).json({
      message: "RETRIEVED TRANSACTIONS SUCCESSFULLY",
      rows: transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/alltransactions", [checkAuth.verifyToken, checkAdmin.verifyAdmin], async (req, res) => {
    try {
      if (!req.isLoggedIn) {
        res.status(401).json("YOU NEED TO LOGIN");
      }
      const transactions = await BlockchainModel.REQUEST_ALL(
        "transaction",
      );
      res.status(200).json({
        message: "RETRIEVED TRANSACTIONS SUCCESSFULLY",
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
      res.status(401).json("YOU NEED TO LOGIN");
    }
    const transactions = await BlockchainModel.REQUEST_BLOCKS_RANGE(
      "transaction",
      req.currentUser.publicKey,
      Number(req.query.range)
    );
    res.status(200).json({
      message: "RETRIEVED TRANSACTIONS SUCCESSFULLY",
      rows: transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/adminrange", [checkAuth.verifyToken, checkAdmin.verifyAdmin], async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("YOU NEED TO LOGIN");
    }
    const transactions = await BlockchainModel.REQUEST_ALL_BLOCKS_RANGE(
      "transaction",
      Number(req.query.range)
    );
    res.status(200).json({
      message: "RETRIEVED TRANSACTIONS SUCCESSFULLY",
      rows: transactions,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("YOU NEED LOGIN");
    }
    const fromUser = await User.REQUEST_ONE(req.currentUser.username);
    const toUser = await User.REQUEST_ONE(req.body.toUser.toLowerCase());
    if (!toUser || !toUser.approved) {
      res
        .status(401)
        .json({ message: "USER DOES NOT EXIST" });
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
        blockchain.addAction(transaction);
        await BlockchainModel.UPDATE(
          { chainType: "transaction" },
          {
            chain: blockchain.getChain(),
          }
        );
      } catch (err) {
        //TODO toast
        res.status(401).json({
          message: "YOU ARE NOT CERTIFIED TO PERFORM THIS ACTION ",
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
        }
      });

      if (newBalance === 0) {
        pusher.trigger("balance-error", "balance-error", { 
          message: req.currentUser.username+"'s balance is zero!"
        });
             }
      res.status(200).json({ message: "TRANSACTION SUCCEEDED" });
    } else {
           res
        .status(401)
        .json({ message: "INSUFFICIENT SUM" });
    }
  } catch (err) {
    throw err;
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
