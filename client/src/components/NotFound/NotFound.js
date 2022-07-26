import { Button } from "@mui/material";
import notfound from "../../images/notfound.svg";
import "./NotFound.css";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";

function NotFound(props) {
  return (
    <div>
      <Logo
        handleState={props.handleState}
        sx={{ display: { xs: "none", md: "flex" } }}
      />
      <div className="not-found">
        <img src={notfound} className="not-found-img" />
        <h1 className="not-found-header">LOST IN SPACE</h1>
      </div>
    </div>
  );
}

export default NotFound;
