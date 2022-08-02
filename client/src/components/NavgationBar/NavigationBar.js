import Logo from "../Logo/Logo";
import "./NavigationBar.css";
import Profile from "../Profile/Profile";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import Balance from "../Balance/Balance";

export default function NavgationBar(props) {
  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            display: { xs: "flex" },
            flexDirection: "row",
          }}
        >
          <Logo
            sx={{ display: { xs: "none", md: "flex" } }}
            handleState={props.handleState}
          />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link to="/transactions" style={{ textDecoration: "none" }}>
              <Button
                onClick={() => props.handleState("Transactions")}
                className="nav-items"
                key="transactions"
                sx={{ my: 2, display: "block" }}
              >
                Transactions
              </Button>
            </Link>
            <Link to="/loans" style={{ textDecoration: "none" }}>
              <Button
                onClick={() => props.handleState("Loans")}
                className="nav-items"
                key="loans"
                sx={{ my: 2, display: "block" }}
              >
                Loans
              </Button>
            </Link>
          </Box>
          <Balance currentUser={props.currentUser}></Balance>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip>
              <Profile auth={props.auth}></Profile>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
