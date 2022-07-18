const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models")("User");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middlewares/check-auth");

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const findUser = await User.REQUEST_ONE(username);
    const verified = bcrypt.compareSync(req.body.password, findUser.password);
    if (verified && findUser.approved) {
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
        .json({ message: "LOGIN SUCCESSFULL", admin:findUser.admin});
    } else if(verified)
    {
      return res
        .status(401)
        .json({ message: "ACCOUNT NOT APPROVED YET"});
    }
    else {
      res.status(404).json({ message: "LOGIN FAILED" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/currentUser", checkAuth.verifyToken, async (req, res) => {
  return res.status(200).json({currentUser: req.currentUser});
});

router.get("/logout", checkAuth.verifyToken, (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "SUCCESSFULLY LOGGED OUT" });
});


module.exports = router;
