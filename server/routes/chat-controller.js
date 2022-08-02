const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Chat = require("../models")("Chat");
const User = require("../models")("User");
const bcrypt = require("bcryptjs");
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");

const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

router.post("/", checkAuth.verifyToken, async (req, res) => {
  try {
    const fromUser = req.currentUser.username;
    const toUser = req.body.toUser;
    const chatUser = fromUser === "admin" ? toUser : fromUser;
    const content = req.body.content;
    const channelName = "chat-" + chatUser;
    const newMessage = {
      from: fromUser,
      to: toUser,
      content: content,
      timestamp: Date.now(),
    };
    pusher.trigger(channelName, "new-message", {
      message: newMessage,
    });
    const messages = (await Chat.REQUEST(channelName))[0].messages;
    messages.push(newMessage);

    await Chat.UPDATE(
      { channelName: channelName },
      {
        messages: messages,
      }
    );
    return res.status(200).json({
      message: "MESSAGE SENT",
      newMessage: newMessage
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/", checkAuth.verifyToken, async (req, res) => {
  try {
    const fromUser = req.currentUser.username;
    const toUser = req.query.toUser;
    const chatUser = fromUser === "admin" ? toUser : fromUser;
    const channelName = "chat-" + chatUser;
    const chat = (await Chat.REQUEST(channelName))[0];

    return res
      .status(200)
      .json({
        chat: chat.messages,
        message: "MESSAGES RETRIEVED SUCCESSFULLY",
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/allusers", [checkAuth.verifyToken,checkAdmin.verifyAdmin], async (req, res) => {
  try {
    const users = (await User.REQUEST()).filter(
      (account) => account.approved && account.username!="admin"
    ).map(user => user.username);
    return res
      .status(200)
      .json({
        users: users,
        message: "USERS RETRIEVED SUCCESSFULLY",
      });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
