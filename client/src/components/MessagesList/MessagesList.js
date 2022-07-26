import React from "react";
import "./MessagesList.scss";

const messages = [
  {
    fromUser: "admin",
    toUser: "naama",
    content: "Hi how can I help?",
    timestamp: "10:00",
  },
  {
    fromUser: "naama",
    toUser: "admin",
    content: "I can't login for some reason :/",
    timestamp: "10:05",
  },
  {
    fromUser: "admin",
    toUser: "naama",
    content: "Try again bitch",
    timestamp: "10:10",
  },
  {
    fromUser: "naama",
    toUser: "admin",
    content: "Worked wow thanks for the help",
    timestamp: "10:15",
  },
  {
    fromUser: "admin",
    toUser: "naama",
    content: "Hi how can I help?",
    timestamp: "10:00",
  },
  {
    fromUser: "naama",
    toUser: "admin",
    content: "I can't login for some reason :/",
    timestamp: "10:05",
  },
  {
    fromUser: "admin",
    toUser: "naama",
    content: "Try again bitch",
    timestamp: "10:10",
  },
  {
    fromUser: "naama",
    toUser: "admin",
    content: "Worked wow thanks for the help",
    timestamp: "10:15",
  },
  {
    fromUser: "admin",
    toUser: "naama",
    content: "Hi how can I help?",
    timestamp: "10:00",
  },
  {
    fromUser: "naama",
    toUser: "admin",
    content: "I can't login for some reason :/",
    timestamp: "10:05",
  },
  {
    fromUser: "admin",
    toUser: "naama",
    content: "Try again bitch",
    timestamp: "10:10",
  },
  {
    fromUser: "naama",
    toUser: "admin",
    content: "Worked wow thanks for the help",
    timestamp: "10:15",
  },
];
const currentUser = "naama";

export default function MessageList() {
  return (
    <div class="a1-column a1-long a1-elastic chat-container">
    <div className="messages-container">
      <div class="a1-column a1-long a1-elastic chat-main a1-spaced-items">
        {messages.map((message) => {
          return (
            <div
              class={
                currentUser === message.fromUser
                  ? "text text-sent"
                  : "text text-recieved"
              }
            >
              <p>{message.content}</p>
              <span class="timestamp a1-row a1-end">{message.timestamp}</span>
            </div>
          );
        })}
      </div>
      </div>
      <div class="a1-row a1-spaced-items a1-center-items-v a1-padding bg-left-panel-header">
        <input
          type="text"
          class="a1-long chat-input"
          placeholder="Type a message"
        />
      </div>
    </div>
  );
}
