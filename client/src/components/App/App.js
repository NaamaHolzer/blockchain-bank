import React from "react";
import Home from "../Home/Home";
import User from "../User/User";
import { BrowserRouter, Routes, Route, Router, Switch } from "react-router-dom";
import NotFound from "../NotFound/NotFound";
import { useEffect } from "react";
import GuardedRoute from "../../util/GuardedRoute";
import Loader from "../Loader/Loader";
import Pusher from "pusher-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pusher = new Pusher("ccaa990cbc0f5017da22", {
  cluster: "ap2",
});

export default function App() {
  const [IsLoggedIn, setIsLoggedIn] = React.useState(false);
  const [CurrentUser, setCurrentUser] = React.useState({});
  const [Loading, setLoading] = React.useState(true);

  const authenticate = (isLoggedIn, currentUser) => {
    setIsLoggedIn(isLoggedIn);
    setCurrentUser(currentUser);
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  };

  const [counter, setCounter] = React.useState(0);

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
            localStorage.setItem("currentUser", res.currentUser);
            setCounter(counter + 1);
            if (res.currentUser.admin) {
              const requestChannel = pusher.subscribe("signup-request");
              requestChannel.bind("new-request", function (data) {
                toast.info(data.message, {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              });

              const balanceChannel = pusher.subscribe("balance-error");
              balanceChannel.bind("balance-error", function (data) {
                toast.info(data.message, {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              });
            }

            const loanAlertChannel = pusher.subscribe(
              "loan-alert" + res.currentUser.username
            );
            loanAlertChannel.bind("loan-alert", function (data) {
              toast.info(data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });
          }
        } catch (err) {
          console.log(err);
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
              accessCondition={IsLoggedIn && CurrentUser.admin}
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
