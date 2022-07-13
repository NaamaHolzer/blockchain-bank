const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models")("User");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middlewares/check-auth");

router.post("/login", async (req, res) => {
  try {
    console.log("in login controller ", req.isLoggedIn);
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
        .json({ message: "Login successful", admin:findUser.admin});
    } else if(verified)
    {
      return res
        .status(401)
        .json({ message: "Account is not approved yet"});
    }
    else {
      console.log("in else");
      res.status(404).json({ message: "Login Failed" });
    }
  } catch (err) {
    console.log("in catch")
    res.status(500).json({ message: err });
  }
});

router.get("/currentUser", checkAuth.verifyToken, async (req, res) => {
  // try {
  //   console.log("currentUser Controller ");
  //   const token = req.cookies.token || "";
  //   if (!token) {
  //     console.log("!token")
  //     res.status(200).json({ isLoggedIn: false });
  //   } else {
  //     console.log("token")
  //     const decrypt = await jwt.verify(token, process.env.TOKEN_SECRET);
  //     isLoggedIn = true;
  //     currentUser = {
  //       username: decrypt.username,
  //       publicKey: decrypt.publicKey,
  //       admin: decrypt.admin,
  //     };
  //     res.status(200).json({
  //       isLoggedIn: true,
  //       currentUser: currentUser.username,
  //       admin: currentUser.admin,
  //     });
  //   }

  // } catch (err) {
  //   return res.status(500).json(err.toString());
  // }
  console.log("in currentUser controller");
  console.log(req.currentUser);
  return res.status(200).json({currentUser: req.currentUser});
});

router.get("/logout", checkAuth.verifyToken, (req, res) => {
  console.log("in logout")
  return res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
});


module.exports = router;
