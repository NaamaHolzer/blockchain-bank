import React from "react";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import ReactDOM from "react-dom/client";
import Home from "./components/Home/Home";
import User from "./components/User/User";
import Loading from "./components/Loader/Loader";
import ActionTable from "./components/ActionTable/ActionTable";
import { BrowserRouter, Routes, Route, Router, Switch } from "react-router-dom";
import NavigationBar from "./components/NavgationBar/NavigationBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NotFound from "./components/NotFound/NotFound";
import { useEffect } from "react";
import GuardedRoute from "./util/GuardedRoute";
import Loader from "./components/Loader/Loader";

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
  const [Loading, setLoading] = React.useState(true);

  const authenticate = (isLoggedIn, currentUser) => {
    setIsLoggedIn(isLoggedIn);
    setCurrentUser(currentUser);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!CurrentUser || Object.keys(CurrentUser).length === 0) {
        try {
          let res = await fetch(
            process.env.REACT_APP_BASE_URL + "/auth/currentUser",
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                accept: "application/json",
              },
              credentials: "include",
            }
          );
          if (res.ok) {
            res = await res.json();
            setIsLoggedIn(true);
            setCurrentUser(res.currentUser);
          }
        } catch (err) {
          console.log("not logged in");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return Loading ? (
    <Loader></Loader>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/requests"
          element={
            <GuardedRoute
              element={
                <User
                  auth={authenticate}
                  initialState={"Requests"}
                  currentUser={CurrentUser}
                />
              }
              accessCondition={IsLoggedIn}
            ></GuardedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <GuardedRoute
              element={
                <User
                  auth={authenticate}
                  initialState={"Transactions"}
                  currentUser={CurrentUser}
                />
              }
              accessCondition={IsLoggedIn}
            ></GuardedRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <GuardedRoute
              element={
                <User
                  auth={authenticate}
                  initialState={"Loans"}
                  currentUser={CurrentUser}
                />
              }
              accessCondition={IsLoggedIn}
            ></GuardedRoute>
          }
        />
        <Route
          path="/"
          element={
            IsLoggedIn ? (
              <User
                initialState={"Greetings"}
                currentUser={CurrentUser}
                auth={authenticate}
              />
            ) : (
              <Home auth={authenticate} />
            )
          }
        ></Route>
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
