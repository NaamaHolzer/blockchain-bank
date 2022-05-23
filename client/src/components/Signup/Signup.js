import { Button, Box, Modal, Typography } from "@mui/material";
import * as React from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import signup from "../../images/signup.svg";
import "./Signup.css";

export default function Signup() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="Signup">
      <Button onClick={handleClickOpen}>
        Sign up here
      </Button>
      <Dialog className="Signup-Dialog" open={open} onClose={handleClose}>
        <img src={signup} className="Signup-img" />
        <h1 className="Signup-header">Join us!</h1>
        <DialogContent className="Signup-DialogContent">
          <TextField
            id="firstName"
            label="First Name"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField
            id="lastName"
            label="Last Name"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField
            id="username"
            label="Username"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField id="email" label="Email" type="email" variant="standard" />
          <br></br>
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="standard"
          />
          <br></br>
        </DialogContent>
        <DialogActions className="Signup-DialogOptions">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Signup</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
