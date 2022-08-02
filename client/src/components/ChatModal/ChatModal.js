import { Button, Box, Modal, Typography } from "@mui/material";
import * as React from "react";
import { TextField, Dialog, DialogActions, DialogContent } from "@mui/material";
import "./ChatModal.css";
import Fab from "@mui/material/Fab";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ChatList from "../ChatList/ChatList";
import MessagesList from "../MessagesList/MessagesList";
import chat from "../../images/chat.svg";

export default function ChatModal(props) {
  const [open, setOpen] = React.useState(false);

  const [messages, setMessages] = React.useState([]);
  const [chatUser, setChatUser] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const updateMessages = (newMessage) => {
    let updatedMessages = [...messages];
    updatedMessages.push(newMessage);
    setMessages(updatedMessages);
  };
  const getMessages = async (username) => {
    try {
      let res = await fetch(
        process.env.REACT_APP_BASE_URL + "/chat?toUser=" + username,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        res = await res.json();
        setMessages(res.chat);
        setChatUser(username);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="chat">
        <Fab
          className="chat-button"
          size="large"
          edge="end"
          color="primary"
          style={{ position: "absolute", top: "85%", marginLeft: "40px" }}
          onClick={handleClickOpen}
        >
          <ChatBubbleOutlineOutlinedIcon color="secondary" />
        </Fab>
        <Dialog open={open} onClose={handleClose} className="dialog">
          <DialogContent>
            <h2 className="header">CHATS</h2>
            <div className="chat-content">
              <ChatList
                currentUser={props.currentUser}
                changeMessagesList={getMessages}
              ></ChatList>
              {messages.length === 0 && chatUser === "" ? (
                <div>
                  <p className="chat-text">{"START CHATTING NOW!"}</p>
                  <img src={chat} className="chat-img" />
                </div>
              ) : (
                <MessagesList
                  currentUser={props.currentUser}
                  chatUser={chatUser}
                  currentMessages={messages}
                  updateMessages={updateMessages}
                ></MessagesList>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
}
