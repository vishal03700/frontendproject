import React, { useState } from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // form handler
  const onfinishHandler = async (values) => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());
      setLoading(false);
      
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Welcome back! Login successful");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
      console.log(error);
      message.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to VisionCare</p>
          </div>

          <Form
            layout="vertical"
            onFinish={onfinishHandler}
            className="register-form"
          >
            <Form.Item 
              label="Email Address" 
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" }
              ]}
            >
              <Input 
                prefix={<i className="fa-solid fa-envelope"></i>}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>
            
            <Form.Item 
              label="Password" 
              name="password"
              rules={[
                { required: true, message: "Please enter your password" }
              ]}
            >
              <Input.Password 
                prefix={<i className="fa-solid fa-lock"></i>}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              className="btn btn-primary auth-btn" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</span>
              ) : (
                <span>Sign In <i className="fa-solid fa-arrow-right"></i></span>
              )}
            </button>
          </Form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>
        </div>

        <div className="auth-info">
          <h3>Healthcare Made Simple</h3>
          <p>Book appointments, manage your health records, and connect with doctors - all in one place.</p>
          <div className="features-preview">
            <div className="feature-item">
              <i className="fa-solid fa-calendar-check"></i>
              <span>Easy Booking</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-user-md"></i>
              <span>Expert Doctors</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-clock"></i>
              <span>24/7 Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
