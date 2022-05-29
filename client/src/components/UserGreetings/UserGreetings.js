import user from "../../images/user.svg";
import admin from "../../images/admin.svg";
import "./UserGreetings.css";
import Fab from "@mui/material/Fab";
import * as React from "react";

export default function UserGreetings(props) {
  return (
    <div className= 'User-div'>
      {props.isAdmin ? (
        <img src={admin} className="Img"></img>
      ) : (
        <img src={user} className="Img"></img>
      )}
      <p className="Greetings">Welcome back, {props.username}!</p>
      {props.isAdmin ? (
        <div className="Actions-div">
          <Fab className="Requests-button" variant="extended" color="primary">
            Pending Requests
          </Fab>
        </div>
      ) : (
        <div className="Actions-div">
          <Fab
            className="Action-button"
            variant="extended"
            color="primary"
          >
            Transfer
          </Fab>
          <Fab
            className="Action-button"
            variant="extended"
            color="primary"
          >
            Loan
          </Fab>
        </div>
      )}
    </div>
  );
}
