import { Button, Box, Modal, Typography } from "@mui/material";
import * as React from "react";
import { TextField, Dialog, DialogActions, DialogContent } from "@mui/material";
import editProfile from "../../images/editProfile.svg";
import "./EditProfile.css";
import { validator } from "validator";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  const [open, setOpen] = React.useState(false);
  const [emailVal, setEmailVal] = React.useState();
  const [firstNameVal, setFirstNameVal] = React.useState();
  const [lastNameVal, setLastNameVal] = React.useState();
  const [userDetails, setUserDetails] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch(
        process.env.REACT_APP_BASE_URL + "/account/getUserDetails",
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
        setUserDetails(res.userDetails);
        setFirstNameVal(res.userDetails.firstName);
        setLastNameVal(res.userDetails.lastName);
        setEmailVal(res.userDetails.email);
      } else {
        res = await res.json();
        toast.error(res.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchData();
  }, []);

  const submitChange = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_BASE_URL + "/account", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstNameVal,
          lastName: lastNameVal,
          email: emailVal,
        }),
      });
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
    } catch (err) {}
  };
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
    <div className="edit">
      <Button onClick={handleClickOpen}>Edit Details </Button>
      <Dialog className="edit-dialog" open={open} onClose={handleClose}>
        <img src={editProfile} className="edit-img" />
        <DialogContent className="edit-dialog-content">
          <TextField
            defaultValue={userDetails.firstName}
            onChange={(e) => setFirstNameVal(e.target.value)}
            id="firstName"
            label="First Name"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField
            defaultValue={userDetails.lastName}
            onChange={(e) => setLastNameVal(e.target.value)}
            id="lastName"
            label="Last Name"
            type="text"
            variant="standard"
          />
          <br></br>
          <TextField
            defaultValue={userDetails.email}
            error={!validateEmail() && emailVal != "" && emailVal != null}
            onChange={(e) => setEmailVal(e.target.value)}
            id="email"
            label="Email"
            type="email"
            variant="standard"
          />
          <br></br>
        </DialogContent>
        <DialogActions className="edit-dialog-options">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitChange}
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
