import { Button } from "@mui/material";
import "./Profile.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { Box } from "@mui/material";
import EditProfile from "../EditProfile/EditProfile";

function Profile(props) {
  const logout = async () => {
    console.log("clicked")
    try {
      let response = await fetch(
        process.env.REACT_APP_BASE_URL + "/auth/logout",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          credentials:"include"
        }
      );
      console.log(response.status);
      if (response.ok || response.status === 401) {
        console.log("logged out successfully")
        console.log(response);
        props.auth(/*isLoggedIn=*/false, {});
      } else {
        response = await response.json();
        alert(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [AnchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(AnchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const renderMenu = (
    <Menu
      PaperProps={{
        style: {
          width: 200,
          height: 115,
        },
      }}
      anchorEl={AnchorEl}
      keepMounted
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClick={handleMenuClose}
    >
      <MenuItem className="Menu-item" color="primary">
        <EditProfile></EditProfile>
      </MenuItem>
      <MenuItem className="Menu-item" color="primary"  onClick={logout}>
        <Button>Logout</Button>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <IconButton size="large" edge="end" className="IconButton">
        <AccountCircleOutlinedIcon
          size="Large"
          className="Icon"
          color="primary"
          onClick={handleMenuOpen}
        />
        {renderMenu}
      </IconButton>
    </Box>
  );
}

export default Profile;
