import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  if (localStorage.getItem("token")) {
    // Redirect authenticated users to the dashboard
    return <Navigate to="/home" />;
  } else {
    return children;
  }
}
