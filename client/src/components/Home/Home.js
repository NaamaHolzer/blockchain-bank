import home from "../../images/home.svg";
import { TextField, InputAdornment, Button, IconButton } from "@mui/material";
import "./Home.css";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React from "react";
import Signup from "../Signup/Signup";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Home(props) {
  const login = async () => {
    try {
      let response = await fetch(
        process.env.REACT_APP_BASE_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            username: usernameFilled,
            password: passwordFilled,
          }),
          credentials:"include"
        }
      );

      if (response.ok) {
        response = await response.json();
        props.auth(/*isLoggedIn=*/true, response.currentUser);
      } else {
        response = await response.json();
        toast.error(response.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });      }
    } catch (err) {
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const [usernameFilled, setUsernameFilled] = React.useState();
  const [passwordFilled, setPasswordFilled] = React.useState();
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  return (
    <div className="home">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <img src={home} className="home-img" />
      <h1 className="home-header">Welcome to Lev Bank</h1>
      <TextField
        className="home-text-field"
        label="Username"
        variant="standard"
        id="standard-basic"
        margin="10px"
        onChange={(e) => setUsernameFilled(e.target.value)}
      />
      <TextField
        className="home-text-field"
        id="input-with-sx"
        label="Password"
        margin="10px"
        variant="standard"
        type={showPassword ? "text" : "password"}
        onChange={(e) => setPasswordFilled(e.target.value)}
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
        onClick={() => login()}
        className="home-button"
        variant="outlined"
        margin="none"
        disabled={!usernameFilled || !passwordFilled}
      >
        Login
      </Button>
      <p className="home-p">Don't have an account yet?</p>
      <Signup auth={props.auth} />
    </div>
  );
}

export default Home;
