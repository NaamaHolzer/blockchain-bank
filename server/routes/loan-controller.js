const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");
const Loan = require("../models")("Loan");
const User = require("../models")("User");
const BlockchainModel = require("../models")("Blockchain");

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1438647",
  key: "ccaa990cbc0f5017da22",
  secret: "00fb676b56ff4d382692",
  cluster: "ap2",
  useTLS: true,
});

const { Blockchain, Action } = require("../blockchain/blockchain");

router.get("/userloans", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("YOU NEED TO LOGIN");
    }
    const loans = await BlockchainModel.REQUEST_USER_BLOCKS(
      "loan",
      req.currentUser.publicKey
    );
    res.status(200).json({
      message: "RETRIEVED LOANS SUCCESSFULLY",
      rows: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get(
  "/allloans",
  [checkAuth.verifyToken, checkAdmin.verifyAdmin],
  async (req, res) => {
    try {
      if (!req.isLoggedIn) {
        res.status(401).json("YOU NEED TO LOG IN");
      }
      const loans = await BlockchainModel.REQUEST_ALL("loan");
      res.status(200).json({
        message: "RETRIEVED LOANS SUCCESSFULLY",
        rows: loans,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    if (!req.isLoggedIn) {
      res.status(401).json("You need to login");
    }
    const fromUser = await User.REQUEST_ONE(req.currentUser.username);
    const toUser = await User.REQUEST_ONE(req.body.toUser.toLowerCase());
    if (!toUser || !toUser.approved) {
      res.status(401).json({ message: "USER DOES NOT EXIST" });
      return;
    }
    const newBalance = fromUser.balance - Number(req.body.amount);
    if (newBalance <= 0.5 * fromUser.balance) {
      res.status(401).json({ message: "INSUFFICIENT SUMS" });
      return;
    }
    if (toUser.balance * 0.6 < Number(req.body.amount)) {
      res.status(401).json({ message: "INSUFFICIENT SUM" });
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

    const userDebts = await BlockchainModel.REQUEST_USER_DEBTS(
      fromUser.publicKey
    );
    userDebts.forEach((debt) => {
      if (debt.amount > 0.6 * newBalance) 
      {
        pusher.trigger("loan-alert"+debt.fromUser, "laon-alert", {
          message: debt.toUser +" WILL SOON NOT BE ABLE TO RETURN YOUR LOAN",
        });
      }
    });

    res.status(200).json({ message: "LOAN SUCCEEDED" });
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
      message: "RETRIEVED LOANS SUCCESSFULLY",
      rows: loans,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get(
  "/adminrange",
  [checkAuth.verifyToken, checkAdmin.verifyAdmin],
  async (req, res) => {
    try {
      if (!req.isLoggedIn) {
        res.status(401).json("You need to login");
      }
      const transactions = await BlockchainModel.REQUEST_ALL_BLOCKS_RANGE(
        "loan",
        Number(req.query.range)
      );
      res.status(200).json({
        message: "RETRIEVED LOANS SUCCESSFULLY",
        rows: transactions,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

module.exports = router;
