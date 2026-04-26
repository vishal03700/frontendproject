import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" />;
  }

  return children;
}
