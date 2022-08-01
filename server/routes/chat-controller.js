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
    const chatUser = fromUser === "admin" ? toUser : fromUser;
    const content = req.body.content;
    const channelName = "chat-" + chatUser;
    pusher.trigger(channelName, "new-message", {
      message: content,
    });
    const messages = (await Chat.REQUEST(channelName))[0].messages;
    messages.push({
      from: fromUser,
      to: toUser,
      content: content,
      timestamp: Date.now(),
    });

    await Chat.UPDATE(
      { channelName: channelName },
      {
        messages: messages,
      }
    );
    return res.status(200).json({
      message: "MESSAGE SENT",
    });
  } catch (err) {
    //res.status(500).json({ message: err });
    throw err;
  }
});

router.get("/", checkAuth.verifyToken, async (req, res) => {
  try {
    const fromUser = req.currentUser.username;
    const toUser = req.query.toUser;
    const chatUser = fromUser === "admin" ? toUser : fromUser;
    const channelName = "chat-" + chatUser;
    const chat = (await Chat.REQUEST(channelName))[0];
    console.log(channelName);
    console.log(chat)

    return res
      .status(200)
      .json({ chat: chat.messages, message: "MESSAGES RETRIEVED SUCCESSFULLY" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
