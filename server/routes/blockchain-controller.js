const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models")("User");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");
const { Blockchain, Action } = require("../blockchain/blockchain");
const BlockchainModel = require("../models")("Blockchain");

router.get("/", checkAdmin.verifyAdmin, async (req, res) => {
  try {
    const loansChain = new Blockchain(
      (await BlockchainModel.REQUEST("loan"))[0]
    );
    const transactionsChain = new Blockchain(
      (await BlockchainModel.REQUEST("transaction"))[0]
    );

    const loansValid = loansChain.isChainValid();
    const transactionsValid = transactionsChain.isChainValid();

    return res
      .status(200)
      .json({ loansValid: loansValid, transactionsValid: transactionsValid });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
