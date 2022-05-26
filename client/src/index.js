import React from "react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import ReactDOM from "react-dom/client";
import Home from "./components/Home/Home"
import User from "./components/User/User";
import NavigationBar from "./components/NavgationBar/NavigationBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  palette: {
    primary: {
      main: "#07877D",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <User username="Kayla" isAdmin={true}/>
        {/* <Home></Home> */}
      </React.StrictMode>
    </ThemeProvider>
  </StyledEngineProvider>
);
