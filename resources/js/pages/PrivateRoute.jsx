import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, ...rest }) => {
  const authToken = localStorage.getItem("auth_token");
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

export default PrivateRoute;
