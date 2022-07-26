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
import ChatList from "../ChatList/ChatList"
import MessagesList from "../MessagesList/MessagesList"

export default function ActionModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} >
        <div className="chat">
        <Fab className = "chat-button"
            size="large"
            edge="end"
            color="primary"
            style={{ position: "absolute", top: "85%",marginLeft:"40px"}}>
          <ChatBubbleOutlineOutlinedIcon
            color="secondary"
            onClick={handleClickOpen}
          />
        </Fab>
        <Dialog open={open} onClose={handleClose} className="dialog">
          <DialogContent>
            <h2 className="header">CHATS</h2>
            <div className="chat-content">
            <ChatList></ChatList>
            <MessagesList></MessagesList>
            </div>
          </DialogContent>
        </Dialog>
        </div>
    </LocalizationProvider>

  );
}
