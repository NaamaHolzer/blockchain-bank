import { Button, Box, Modal, Typography } from "@mui/material";
import * as React from "react";
import { TextField, Dialog, DialogActions, DialogContent } from "@mui/material";
import editProfile from "../../images/editProfile.svg";
import "./EditProfile.css";

export default function EditProfile() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="Edit">
      <Button onClick={handleClickOpen}>Edit Details </Button>
      <Dialog className="Edit-Dialog" open={open} onClose={handleClose}>
        <img src={editProfile} className="Edit-img" />
        <DialogContent className="Edit-DialogContent">
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
          <TextField id="email" label="Email" type="email" variant="standard" />
          <br></br>
        </DialogContent>
        <DialogActions className="Edit-DialogOptions">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
