import { Button, Box, Modal, Typography } from "@mui/material";
import * as React from "react";
import { TextField, Dialog, DialogActions, DialogContent } from "@mui/material";
import editProfile from "../../images/editProfile.svg";
import "./EditProfile.css";
import { validator } from "validator";

export default function EditProfile() {
  const [open, setOpen] = React.useState(false);
  const [emailVal, setEmailVal] = React.useState();
  const [firstNameVal, setFirstNameVal] = React.useState();
  const [lastNameVal, setLastNameVal] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const validateEmail = () => {
    if (
      String(emailVal)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    )
      return true;
    else return false;
  };

  return (
    <div className="Edit">
      <Button onClick={handleClickOpen}>Edit Details </Button>
      <Dialog className="Edit-Dialog" open={open} onClose={handleClose}>
        <img src={editProfile} className="Edit-img" />
        <DialogContent className="Edit-DialogContent">
          <TextField
            onChange={(e) => setFirstNameVal(e.target.value)}
            id="firstName"
            label="First Name"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField
            onChange={(e) => setLastNameVal(e.target.value)}
            id="lastName"
            label="Last Name"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField
            error={!validateEmail() && emailVal != "" && emailVal != null}
            onChange={(e) => setEmailVal(e.target.value)}
            id="email"
            label="Email"
            type="email"
            variant="standard"
          />
          <br></br>
        </DialogContent>
        <DialogActions className="Edit-DialogOptions">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleClose}
            disabled={
              !emailVal || !firstNameVal || !lastNameVal || !validateEmail()
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
