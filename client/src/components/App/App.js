import React from "react";
import Home from "../Home/Home";
import User from "../User/User";
import { BrowserRouter, Routes, Route, Router, Switch } from "react-router-dom";
import NotFound from "../NotFound/NotFound";
import { useEffect } from "react";
import GuardedRoute from "../../util/GuardedRoute";
import Loader from "../Loader/Loader";
import Pusher from "pusher-js";




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
            console.log("Not logged in");
          }
        }
        setLoading(false);
      };
  
      const pusher = new Pusher('ccaa990cbc0f5017da22', {
        cluster: 'ap2'
      });
    
      const channel = pusher.subscribe('my-channel');
      channel.bind('my-event', function(data) {
        alert(JSON.stringify(data));
      });
    
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