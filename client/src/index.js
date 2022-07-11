import React from "react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import ReactDOM from "react-dom/client";
import Home from "./components/Home/Home";
import User from "./components/User/User";
import ActionTable from "./components/ActionTable/ActionTable";
import { BrowserRouter, Routes, Route, Router, Switch } from "react-router-dom";
import NavigationBar from "./components/NavgationBar/NavigationBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NotFound from "./components/NotFound/NotFound";
import { useEffect } from "react";

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

export default function App() {
  const [IsLoggedIn, setIsLoggedIn] = React.useState(false);
  const [CurrentUser, setCurrentUser] = React.useState({});

  const authenticate = () => {

    fetch('http://localhost:8080'+"/auth/currentUser", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.isLoggedIn);
        return response;
      })
      .then((response) => {
        setIsLoggedIn(response.isLoggedIn);
        if(response.isLoggedIn){
        const currentUser = {username:response.currentUser.username, isAdmin:response.currentUser.isAdmin}
        setCurrentUser(currentUser);}
      })
      .catch((err) => {
        console.log(err);
      });
    //do something to check if logged in
  };
  useEffect(()=>authenticate())

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            IsLoggedIn ? (
              <User initialState={"Greetings"} currentUser={CurrentUser} />
            ) : (
              <Home auth={authenticate} />
            )
          }
        ></Route>
        <Route
          path="transactions"
          element={
            <User initialState={"Transactions"} currentUser={CurrentUser} />
          }
        />
        <Route
          path="loans"
          element={<User initialState={"Loans"} currentUser={CurrentUser} />}
        />
        <Route
          path="requests"
          element={
            CurrentUser.isAdmin ? (
              <User initialState={"Requests"} currentUser={CurrentUser} />
            ) : (
              <NotFound />
            )
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <App></App>
      </React.StrictMode>
    </ThemeProvider>
  </StyledEngineProvider>
);
