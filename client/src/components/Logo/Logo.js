import { Button } from "@mui/material";
import logo from "../../images/logo.svg";
import "./Logo.css";

function Logo() {
  return (
    <Button className="Logo-container">
      <img src={logo} className="Logo-img" />
          </Button>
  );
}

export default Logo;