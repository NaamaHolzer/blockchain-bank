import { React, useEffect, useState, useCallback, useRef } from "react";
import "./MessagesList.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pusher from "pusher-js";

const pusher = new Pusher("ccaa990cbc0f5017da22", {
  cluster: "ap2",
});

export default function MessageList(props) {
  const [inputMessage, setInputMessage] = useState();
  const scrollRef = useRef(null);


  const sendMessage = async (content) => {
    try {
      let response = await fetch(process.env.REACT_APP_BASE_URL + "/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          toUser: props.chatUser,
          content: content,
        }),
        credentials: "include",
      });

      if (response.ok) {
        response = await response.json();
        const message = response.newMessage;
        props.updateMessages(message);
      } else {
        response = await response.json();
        toast.error(response.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {}
  };

  const fetchData = useCallback(async () => {
    let res = await fetch(process.env.REACT_APP_BASE_URL + "/chat/allusers", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      res = await res.json();
      for (let user in res.users) {
        let chatChannel = pusher.subscribe("chat-" + res.users[user]);
        chatChannel.bind("new-message", function (data) {
          if (data.message.from != "admin") {
            props.updateMessages(data.message);
          }
        });
      }
    }
  });

  useEffect(() => {
    const scroller = scrollRef.current;
    scroller.scrollTop = scroller.scrollHeight;
    if (props.currentUser.admin) {
      try {
        fetchData().catch(console.error);
      } catch (err) {
        console.log(err);
      }
    } else {
      const chatChannel = pusher.subscribe(
        "chat-" + props.currentUser.username
      );
      chatChannel.bind("new-message", function (data) {
        if (data.message.from != props.currentUser.username) {
          props.updateMessages(data.message);
        }
      });
    }
  });

  return (
    <div class="a1-column-messages a1-long a1-elastic chat-container">
      <div className="chat-user">{props.chatUser}</div>
      <div className="messages-container">
        <div ref={scrollRef} class="a1-column-messages a1-long a1-elastic chat-main a1-spaced-items">
          {props.currentMessages.map((message) => {
            return (
              <div
                className={
                  props.currentUser.username === message.from
                    ? "text text-sent"
                    : "text text-recieved"
                }
              >
                <p>{message.content}</p>
                <span class="timestamp a1-row a1-end">
                  {(
                    "000" + new Date(Number(message.timestamp)).getHours()
                  ).slice(-2) +
                    ":" +
                    (
                      "000" + new Date(Number(message.timestamp)).getMinutes()
                    ).slice(-2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div class="a1-row a1-spaced-items a1-center-items-v a1-padding bg-left-panel-header">
        <input
          defaultValue=""
          type="text"
          class="a1-long chat-input"
          placeholder="Type a message"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
