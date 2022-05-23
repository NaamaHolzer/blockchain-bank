import React from "react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import ReactDOM from "react-dom/client";
import Home from "./components/Home/Home";
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
      main: "#07877D",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <Home />
      </React.StrictMode>
    </ThemeProvider>
  </StyledEngineProvider>
);
