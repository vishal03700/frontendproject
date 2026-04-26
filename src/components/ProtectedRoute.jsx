import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userApi } from "../api/client";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { clearSession, isAuthenticated } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    dispatch(showLoading());

    try {
      const response = await userApi.getCurrentUser();

      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        clearSession();
        window.location.href = "/login";
      }
    } catch (error) {
      clearSession();
      window.location.href = "/login";
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthenticated()) {
    return children;
  }

  return <Navigate to="/login" />;
}
