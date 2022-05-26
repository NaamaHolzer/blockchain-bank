import Logo from "../Logo/Logo";
import "./NavigationBar.css";
import Profile from "../Profile/Profile";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

export default function NavgationBar() {
  return (
    <AppBar position="static" color="secondary" >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            display: { xs: "flex" },
            flexDirection: "row",
          }}
        >
          <Logo sx={{ display: { xs: "none", md: "flex" } }} />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              className="Nav-items"
              key="transactions"
              sx={{ my: 2, display: "block" }}
            >
              Transactions
            </Button>
            <Button
              className="Nav-items"
              key="loans"
              sx={{ my: 2, display: "block" }}
            >
              Loans
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip>
              <Profile></Profile>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
