import React from 'react';
import { Route, Navigate } from "react-router-dom";

const GuardedRoute = ({ element, accessCondition }) => {
    console.log("in guarded")
    console.log(accessCondition)
    return accessCondition? element: <Navigate to='/' />
}

export default GuardedRoute;
