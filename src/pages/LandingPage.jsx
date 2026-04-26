import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { 
  CalendarOutlined, 
  TeamOutlined, 
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  SafetyOutlined
} from "@ant-design/icons";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <span className="brand-name">VisionCare</span>
          </div>
          
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </div>
          
          <div className="nav-actions">
            <Link to="/login">
              <Button type="text" className="nav-login-btn">Log In</Button>
            </Link>
            <Link to="/register">
              <Button className="nav-signup-btn">Get Started</Button>
            </Link>
          </div>
          
          <button className="mobile-menu-btn">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span>
              India's Trusted Healthcare Platform
            </div>
            
            <h1 className="hero-title">
              Your Health Journey, <span className="highlight">Simplified</span>
            </h1>
            
            <p className="hero-subtitle">
              Connect with expert doctors, book appointments seamlessly, and manage your healthcare journey all in one secure platform.
            </p>
            
            <div className="hero-actions">
              <Link to="/register">
                <Button size="large" className="hero-primary-btn">
                  Get Started Free <i className="fa-solid fa-arrow-right"></i>
                </Button>
              </Link>
              <Link to="/login">
                <Button size="large" className="hero-secondary-btn">
                  <i className="fa-solid fa-user-doctor"></i> I'm a Doctor
                </Button>
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-number">500+</span>
                <span className="stat-label">Verified Doctors</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Patients</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-box">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <div className="card-icon">
                <CalendarOutlined />
              </div>
              <div className="card-content">
                <h4>Easy Booking</h4>
                <p>Schedule appointments in seconds</p>
              </div>
            </div>
            
            <div className="hero-card hero-card-2">
              <div className="card-icon green">
                <TeamOutlined />
              </div>
              <div className="card-content">
                <h4>Expert Care</h4>
                <p>Connect with specialists</p>
              </div>
            </div>
            
            <div className="hero-card hero-card-3">
              <div className="card-icon blue">
                <MedicineBoxOutlined />
              </div>
              <div className="card-content">
                <h4>Quality Service</h4>
                <p>Personalized healthcare</p>
              </div>
            </div>
            
            <div className="hero-floating">
              <div className="floating-badge">
                <i className="fa-solid fa-check-circle"></i>
                <span>Verified Doctors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-container">
          <div className="about-content">
            <div className="section-label">About VisionCare</div>
            <h2 className="section-title">
              Transforming Healthcare <span className="highlight">Management</span>
            </h2>
            <p className="section-description">
              VisionCare Scheduler is a comprehensive hospital management system designed to bridge the gap between patients and healthcare providers. Our platform simplifies appointment booking, streamlines administrative processes, and ensures quality care delivery.
            </p>
            
            <div className="about-features">
              <div className="about-item">
                <CheckCircleOutlined className="check-icon" />
                <div>
                  <h4>Seamless Appointments</h4>
                  <p>Book appointments with your preferred doctors in just a few clicks</p>
                </div>
              </div>
              <div className="about-item">
                <CheckCircleOutlined className="check-icon" />
                <div>
                  <h4>Real-time Updates</h4>
                  <p>Get instant notifications about appointment status and changes</p>
                </div>
              </div>
              <div className="about-item">
                <CheckCircleOutlined className="check-icon" />
                <div>
                  <h4>Secure Platform</h4>
                  <p>Your health data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-visual">
            <div className="about-image-container">
              <div className="about-image">
                <i className="fa-solid fa-stethoscope"></i>
              </div>
              <div className="about-image-badge badge-1">
                <CalendarOutlined /> Instant Booking
              </div>
              <div className="about-image-badge badge-2">
                <TeamOutlined /> 500+ Doctors
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-label">Key Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              Powerful features designed to make healthcare management effortless
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <CalendarOutlined />
              </div>
              <h3>Smart Scheduling</h3>
              <p>Book appointments based on doctor availability with real-time scheduling</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper green">
                <TeamOutlined />
              </div>
              <h3>Doctor Network</h3>
              <p>Access to verified healthcare professionals across multiple specializations</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper blue">
                <MedicineBoxOutlined />
              </div>
              <h3>Patient Records</h3>
              <p>Securely manage and access patient history and medical records</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper orange">
                <ClockCircleOutlined />
              </div>
              <h3>Time Management</h3>
              <p>Efficient time slots for doctors and patients alike</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper purple">
                <HeartOutlined />
              </div>
              <h3>Health Tracking</h3>
              <p>Monitor your health journey and appointment history</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper teal">
                <SafetyOutlined />
              </div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with industry-leading security measures</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header-center">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Simple Steps to Better Health</h2>
            <p className="section-subtitle">
              Get started in minutes with our easy-to-use platform
            </p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h3>Create Account</h3>
              <p>Sign up for free and create your personal healthcare profile</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <i className="fa-solid fa-search"></i>
              </div>
              <h3>Find a Doctor</h3>
              <p>Browse through our network of verified doctors and specialists</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3>Book Appointment</h3>
              <p>Select a convenient time slot and book your appointment instantly</p>
            </div>
            
            <div className="step-connector"></div>
            
            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Get Care</h3>
              <p>Visit your doctor and receive quality healthcare services</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Transform Your Healthcare Experience?</h2>
            <p>Join thousands of patients who trust VisionCare for their healthcare needs</p>
            <div className="cta-buttons">
              <Link to="/register">
                <Button size="large" className="cta-primary-btn">
                  Get Started Today <i className="fa-solid fa-arrow-right"></i>
                </Button>
              </Link>
              <Link to="/login">
                <Button size="large" className="cta-secondary-btn">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <span>VisionCare</span>
              </div>
              <p>India's trusted healthcare scheduling platform. Making quality healthcare accessible to everyone.</p>
              <div className="footer-social">
                <a href="#"><i className="fa-brands fa-facebook"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin"></i></a>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <Link to="/#about">About Us</Link>
              <Link to="/#features">Features</Link>
              <Link to="/#how-it-works">How It Works</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            
            <div className="footer-links">
              <h4>For Doctors</h4>
              <Link to="/register">Join as Doctor</Link>
              <Link to="/login">Doctor Dashboard</Link>
              <Link to="/login">Manage Appointments</Link>
              <Link to="/login">Profile Settings</Link>
            </div>
            
            <div className="footer-links">
              <h4>Contact</h4>
              <a href="mailto:support@visioncare.com"><i className="fa-solid fa-envelope"></i> support@visioncare.com</a>
              <a href="tel:+911234567890"><i className="fa-solid fa-phone"></i> +91 12345 67890</a>
              <span><i className="fa-solid fa-location-dot"></i> India</span>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 VisionCare Scheduler. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;