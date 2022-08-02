import React from "react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./components/App/App";

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
      <App></App>
    </ThemeProvider>
  </StyledEngineProvider>
);
