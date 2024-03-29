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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup(props) {
  const [open, setOpen] = React.useState(false);
  const [emailVal, setEmailVal] = React.useState();
  const [firstNameVal, setFirstNameVal] = React.useState();
  const [lastNameVal, setLastNameVal] = React.useState();
  const [usernameVal, setUsernameVal] = React.useState();
  const [passwordVal, setPasswordVal] = React.useState();
  const submitRequest = async () => {
    try {
      let response = await fetch(
        process.env.REACT_APP_BASE_URL + "/account/request",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            email: emailVal,
            firstName: firstNameVal,
            lastName: lastNameVal,
            password: passwordVal,
            username: usernameVal,
          }),
          credentials: "include",
        }
      );
      if (response.ok) {
        handleClose();
        response = await response.json();
        toast.success(response.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
    } catch (err) {
      console.log(err);
    }
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="signup">
      <Button onClick={handleClickOpen}>Sign up here</Button>
      <Dialog className="signup-dialog" open={open} onClose={handleClose}>
        <img src={signup} className="signup-img" />
        <h1 className="signup-header">Join us!</h1>
        <DialogContent className="signup-dialog-content">
          <TextField
            id="firstName"
            label="First Name"
            type="text"
            variant="standard"
            onChange={(e) => setFirstNameVal(e.target.value)}
          />
          <br></br>
          <TextField
            id="lastName"
            label="Last Name"
            type="text"
            variant="standard"
            onChange={(e) => setLastNameVal(e.target.value)}
          />
          <br></br>
          <TextField
            id="username"
            label="Username"
            type="text"
            variant="standard"
            onChange={(e) => setUsernameVal(e.target.value)}
          />
          <br></br>
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="standard"
            onChange={(e) => setEmailVal(e.target.value)}
            error={!validateEmail() && emailVal != "" && emailVal != null}
          />
          <br></br>
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="standard"
            onChange={(e) => setPasswordVal(e.target.value)}
          />
          <br></br>
        </DialogContent>
        <DialogActions className="signup-dialog-options">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitRequest}
            disabled={
              !emailVal ||
              !firstNameVal ||
              !lastNameVal ||
              !passwordVal ||
              !usernameVal ||
              !validateEmail()
            }
          >
            Signup
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
