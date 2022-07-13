import React from 'react';
import { Route, Navigate } from "react-router-dom";

const GuardedRoute = ({ element, accessCondition }) => {
    return accessCondition? element: <Navigate to='/' />
}

export default GuardedRoute;
