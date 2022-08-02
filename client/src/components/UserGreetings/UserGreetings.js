import user from "../../images/user.svg";
import admin from "../../images/admin.svg";
import "./UserGreetings.css";
import Fab from "@mui/material/Fab";
import * as React from "react";
import ActionModal from "../ActionModal/ActionModal";
import { Link } from "react-router-dom";

export default function UserGreetings(props) {
  return (
    <div className="user-div">
      {props.currentUser.admin ? (
        <img src={admin} className="img-admin"></img>
      ) : (
        <img src={user} className="img"></img>
      )}
      <p className="greetings">
        Welcome back,{" "}
        {props.currentUser.username[0].toUpperCase() +
          props.currentUser.username.substring(1)}
        !
      </p>
      {props.currentUser.admin ? (
        <Link to="/requests" style={{ textDecoration: "none" }}>
          <div className="actions-div">
            <Fab
              className="requests-button"
              variant="extended"
              color="primary"
              onClick={() => props.handleState("Requests")}
            >
              Pending Requests
            </Fab>
          </div>
        </Link>
      ) : (
        <div className="actions-div">
          <ActionModal action="TRANSFER" />
          <ActionModal action="LOAN" />
        </div>
      )}
    </div>
  );
}
