import React, { useState } from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // form handler
  const onfinishHandler = async (values) => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      setLoading(false);
      
      if (res.data.success) {
        message.success("Account created successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
      console.log(error);
      message.error("Unable to create account. Please try again.");
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
            <h2>Create Account</h2>
            <p>Join VisionCare for better healthcare</p>
          </div>

          <Form
            layout="vertical"
            onFinish={onfinishHandler}
            className="register-form"
          >
            <Form.Item 
              label="Full Name" 
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 2, message: "Name must be at least 2 characters" }
              ]}
            >
              <Input 
                prefix={<i className="fa-solid fa-user"></i>}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>
            
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
                { required: true, message: "Please enter a password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password 
                prefix={<i className="fa-solid fa-lock"></i>}
                placeholder="Create a password"
                size="large"
              />
            </Form.Item>

            <div className="terms-notice">
              <p>By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></p>
            </div>

            <button 
              className="btn btn-primary auth-btn" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span><i className="fa-solid fa-spinner fa-spin"></i> Creating account...</span>
              ) : (
                <span>Create Account <i className="fa-solid fa-arrow-right"></i></span>
              )}
            </button>
          </Form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>

        <div className="auth-info">
          <h3>Your Health, Our Priority</h3>
          <p>Join thousands of patients who trust VisionCare for their healthcare needs. Experience modern healthcare management like never before.</p>
          <div className="features-preview">
            <div className="feature-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Secure & Private</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span>Easy Access</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-headset"></i>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
