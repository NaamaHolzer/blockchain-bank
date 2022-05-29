import { Button } from "@mui/material";
import logo from "../../images/logo.svg";
import "./Logo.css";

function Logo(props) {
  return (
    <Button className="Logo-container">
      <img
        src={logo}
        className="Logo-img"
        onClick={() => props.handleState("Greetings")}
      />
    </Button>
  );
}

export default Logo;
