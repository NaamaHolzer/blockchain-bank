import { Button } from "@mui/material";
import logo from "../../images/logo.svg";
import "./Logo.css";
import { Link } from "react-router-dom";

function Logo(props) {
  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <Button className="logo-container">
        <img
          src={logo}
          className="logo-img"
          onClick={() => props.handleState("Greetings")}
        />
      </Button>
    </Link>
  );
}

export default Logo;
