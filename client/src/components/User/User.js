import NavigationBar from "../NavgationBar/NavigationBar";
import UserGreetings from "../UserGreetings/UserGreetings";
import ActionTable from "../ActionTable/ActionTable";
import Requests from "../Requests/Requests";
import "./User.css";
import Fab from "@mui/material/Fab";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import * as React from "react";

function User(props) {
  const [AnchorEl, setAnchorEl] = React.useState("Greetings");
  const handleState = (state) => {
    console.log(state);
    setAnchorEl(state);
  };

  return (
    <div className="User-div">
      <NavigationBar handleState={handleState}></NavigationBar>
      {(() => {
        const anchorEl = { AnchorEl };
        switch (anchorEl.AnchorEl) {
          case "Greetings":
            return (
              <UserGreetings
                username={props.username}
                isAdmin={props.isAdmin}
                handleState={handleState}
              ></UserGreetings>
            );
          case "Transactions":
            return <ActionTable action="TRANSACTIONS"></ActionTable>;
          case "Loans":
            return <ActionTable action="LOANS"></ActionTable>;
          case "Requests":
            return <Requests></Requests>;
          default:
            return <p>{AnchorEl}</p>;
        }
      })()}
      <Fab
        className="Chat-button"
        size="large"
        edge="end"
        color="primary"
        style={{ position: "absolute", top: "90%" }}
      >
        <ChatBubbleOutlineOutlinedIcon className="Chat-icon" color="primary" />
      </Fab>
    </div>
  );
}
export default User;
