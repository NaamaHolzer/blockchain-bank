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
import GuardedRoute from "./util/GuardedRoute";

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

  const authenticate = (isLoggedIn, currentUser) => {
    setIsLoggedIn(isLoggedIn);
    setCurrentUser(currentUser);
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(CurrentUser);
      if (!CurrentUser || Object.keys(CurrentUser).length === 0) {
        console.log("fetching");
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
          console.log("res ok");
          console.log(res.isLoggedIn);
          setIsLoggedIn(true);
          setCurrentUser(res.currentUser);
        }
      }
    };

    fetchData();
  }, []);

  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route
  //         path="/"
  //         element={
  //           IsLoggedIn ? (
  //             <User initialState={"Greetings"} currentUser={CurrentUser} auth={authenticate} />
  //           ) : (
  //             <Home auth={authenticate} />
  //           )
  //         }
  //       ></Route>
  //       <Route
  //         path="transactions"
  //         element={IsLoggedIn ? (
  //           <User
  //             auth={authenticate}
  //             initialState={"Transactions"}
  //             currentUser={CurrentUser}
  //           />
  //         ) : (
  //             <Home auth={authenticate} />
  //           )
  //         }
  //       />
  //       <Route
  //         path="loans"
  //         element={
  //           <User
  //             auth={authenticate}
  //             initialState={"Loans"}
  //             currentUser={CurrentUser}
  //           />
  //         }
  //       />
  //       <Route
  //         path="requests"
  //         element={
  //           IsLoggedIn && CurrentUser?.admin ? (
  //             <User
  //               auth={authenticate}
  //               initialState={"Requests"}
  //               currentUser={CurrentUser}
  //             />
  //           ) : (
  //             <NotFound />
  //           )
  //         }
  //       />
  //       <Route path="/*" element={<NotFound />} />
  //     </Routes>
  //   </BrowserRouter>
  // );

  return (
    <BrowserRouter>
      <Routes>
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
