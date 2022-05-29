import NavigationBar from "../NavgationBar/NavigationBar";
import UserGreetings from "../UserGreetings/UserGreetings";
import "./User.css";
import Fab from "@mui/material/Fab";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import * as React from "react";

function User(props) {

  const [AnchorEl, setAnchorEl] = React.useState("Greetings");
  const handleState=(state)=>{ 
    console.log(state);
    setAnchorEl(state);
  };

  return (
    <div className="User-div">
      <NavigationBar handleState={handleState}></NavigationBar>
      {(()=>{
        const anchorEl = {AnchorEl};
        switch (anchorEl.AnchorEl) 
        {
          case 'Greetings':
            return (
              <UserGreetings
                username={props.username}
                isAdmin={props.isAdmin}
              ></UserGreetings>
            );
          case "Transactions":
            return <p>Transactions</p>;
          case "Loans":
            return <p>Loans</p>;
          default:
            console.log(anchorEl.AnchorEl==="Greetings")
            return <p>{AnchorEl}</p>;
        }
      })()}
      <Fab className="Chat-button" size="large" edge="end" color="primary">
        <ChatBubbleOutlineOutlinedIcon className="Chat-icon" color="primary" />
      </Fab>
    </div>
  );
}
export default User;
