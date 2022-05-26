import NavigationBar from "../NavgationBar/NavigationBar";
import user from "../../images/user.svg";
import admin from "../../images/admin.svg";
import "./User.css";
import Fab from "@mui/material/Fab";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

function User(props) {
  return (
    <div className="User-div">
      <NavigationBar></NavigationBar>
      {props.isAdmin?
      <img src={admin} className="Img"></img>:
      <img src={user} className="Img"></img>}
      <p className="Greetings">Welcome back, {props.username}!</p>
      {props.isAdmin ? 
      <div className="Actions-div">
      <Fab className="Requests-button" variant="extended" color="primary">
        Pending Requests
      </Fab>
    </div>
      : 
      <div className="Actions-div">
      <Fab className="Action-button" variant="extended" color="primary">
        Transfer
      </Fab>
      <Fab className="Action-button" variant="extended" color="primary">
        Loan
      </Fab>
    </div>
      }
      <Fab className="Chat-button" size="large" edge="end" color="primary">
        <ChatBubbleOutlineOutlinedIcon className="Chat-icon" color="primary" />
      </Fab>
    </div>
  );
}
export default User;
