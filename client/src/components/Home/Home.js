import home from "../../images/home.svg";
import {
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import "./Home.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { useState } from "react";
import Signup from "../Signup/Signup";

function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  return (
    <div className="Home">
      <img src={home} className="Home-img" />
      <h1 className="Home-header">Welcome to Lev Bank</h1>
      <TextField
      className="Home-TextField"
        label="Username"
        variant="standard"
        id="standard-basic"
        margin="10px"
      />
      <TextField
        id="input-with-sx"
        label="Password"
        margin="10px"
        variant="standard"
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                className="eye-icon"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        className="Home-Button"
        variant="outlined"
        margin="none"
      >
        Login
      </Button>
      <p className="Home-p">
        Don't have an account yet?
      </p>
      <Signup />
    </div>
  );
}

export default Home;
