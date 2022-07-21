const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Chat = require("../models")("Chat");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middlewares/check-auth");

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1438647",
  key: "ccaa990cbc0f5017da22",
  secret: "00fb676b56ff4d382692",
  cluster: "ap2",
  useTLS: true,
});

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    const fromUser = req.currentUser.username;
    const toUser = req.body.toUser;
    const content = req.body.content;
    pusher.trigger("chat" + fromUser + toUser, "new-message", {
      message: content,
    });
    await Chat.CREATE({
      from: fromUser,
      to: toUser,
      content: content,
      timestamp: Date.now(),
    });
    return res.status(200).json({
      message: "MESSAGE SENT",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/", checkAuth.verifyToken, async (req, res) => {
  try {
    const fromUser = req.currentUser.username;
    const toUser = req.query.toUser;
    const chat = await Chat.REQUEST(fromUser, toUser);
    return res.status(200).json({ chat: chat ,message: "MESSAGES RETRIEVED SUCCESSFULLY"});
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
