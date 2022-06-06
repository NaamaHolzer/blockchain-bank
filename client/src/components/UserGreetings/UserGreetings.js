import user from "../../images/user.svg";
import admin from "../../images/admin.svg";
import "./UserGreetings.css";
import Fab from "@mui/material/Fab";
import * as React from "react";
import ActionModal from "../ActionModal/ActionModal";
import { Link } from "react-router-dom";

export default function UserGreetings(props) {
  return (
    <div className="User-div">
      {props.currentUser.isAdmin ? (
        <img src={admin} className="ImgAdmin"></img>
      ) : (
        <img src={user} className="Img"></img>
      )}
      <p className="Greetings">Welcome back, {props.currentUser.username}!</p>
      {props.currentUser.isAdmin ? (
        <Link to="/requests" style={{ textDecoration: "none" }}>
          <div className="Actions-div">
            <Fab
              className="Requests-button"
              variant="extended"
              color="primary"
              onClick={() => props.handleState("Requests")}
            >
              Pending Requests
            </Fab>
          </div>
        </Link>
      ) : (
        <div className="Actions-div">
          <ActionModal action="TRANSFER" />
          <ActionModal action="LOAN" />
        </div>
      )}
    </div>
  );
}
