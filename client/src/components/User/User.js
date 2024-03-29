import NavigationBar from "../NavgationBar/NavigationBar";
import UserGreetings from "../UserGreetings/UserGreetings";
import NotFound from "../NotFound/NotFound";
import Home from "../Home/Home";
import ActionTable from "../ActionTable/ActionTable";
import Requests from "../Requests/Requests";
import "./User.css";
import Fab from "@mui/material/Fab";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import * as React from "react";
import ChatModal from "../ChatModal/ChatModal";
function User(props) {
  const [AnchorEl, setAnchorEl] = React.useState(props.initialState);
  const handleState = (state) => {
    setAnchorEl(state);
  };

  return (
    <div>
      {props.currentUser ? (
        <div className="User-div">
          <NavigationBar
            currentUser={props.currentUser}
            auth={props.auth}
            handleState={handleState}
          ></NavigationBar>
          {(() => {
            const anchorEl = { AnchorEl };
            switch (anchorEl.AnchorEl) {
              case "Greetings":
                return (
                  <UserGreetings
                    currentUser={props.currentUser}
                    handleState={handleState}
                  ></UserGreetings>
                );
              case "Transactions":
                return (
                  <ActionTable
                    admin={props.currentUser.admin}
                    action="transaction"
                  ></ActionTable>
                );
              case "Loans":
                return (
                  <ActionTable
                    admin={props.currentUser.admin}
                    action="loan"
                  ></ActionTable>
                );
              case "Requests":
                return <Requests></Requests>;
              default:
                return <p>{AnchorEl}</p>;
            }
          })()}
          <ChatModal currentUser={props.currentUser} />
        </div>
      ) : (
        <div>
          <Home auth={props.auth} />
        </div>
      )}
    </div>
  );
}
export default User;
