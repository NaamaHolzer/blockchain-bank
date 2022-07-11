const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models")("User");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middlewares/check-auth");

router.post("/login", async (req, res) => {
  const username = req.body.username.toLowerCase();
  const findUser = await User.REQUEST_ONE(username);
  const verified = bcrypt.compareSync(req.body.password, findUser.password);
  if (verified) {
    const token = jwt.sign(
      {
        username: username,
        admin: findUser.admin,
        publicKey: findUser.publicKey,
      },
      process.env.TOKEN_SECRET
    );
    return res
      .cookie("token", token, {
        secure: false, // since we're not using https
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Login successful" });
  } else {
    res.status(500).json({ message: "Username or password incorrect" });
  }
});

router.get("/currentUser",checkAuth.verifyToken, async (req, res) => {
  try {
    console.log("#######")
    console.log(req.isLoggedIn)
    if (req.isLoggedIn) {
      res
        .status(200)
        .json({ isLoggedIn: true, currentUser: req.currentUser.username, isAdmin: req.currentUser.isAdmin });
    } else {
      res.status(200).json({ isLoggedIn: false });
    }
  } catch (err) {
    return res.status(500).json(err.toString());
  }
});

module.exports = router;
