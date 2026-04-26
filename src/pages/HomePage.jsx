import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";
import { Row, Col, Card, Button, Empty, message } from "antd";
import { 
  CalendarOutlined, 
  TeamOutlined, 
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import DoctorList from "../components/DoctorList";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/client";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getDoctors = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllDoctors();

      if (response.success) {
        setDoctors(response.data);
      }
    } catch (error) {
      message.error(error.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Feature cards data
  const features = [
    {
      icon: <CalendarOutlined />,
      title: "Easy Scheduling",
      description: "Book appointments with just a few clicks",
      color: "#ff6b35"
    },
    {
      icon: <TeamOutlined />,
      title: "Expert Doctors",
      description: "Connect with verified healthcare professionals",
      color: "#2a9d8f"
    },
    {
      icon: <MedicineBoxOutlined />,
      title: "Quality Care",
      description: "Receive personalized medical attention",
      color: "#457b9d"
    },
    {
      icon: <CheckCircleOutlined />,
      title: "Quick Confirmation",
      description: "Get instant appointment confirmations",
      color: "#f4a261"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Trusted Healthcare Platform
          </div>
          <h1 className="hero-title">
            Your Health, <span className="highlight">Our Priority</span>
          </h1>
          <p className="hero-subtitle">
            Connect with expert doctors, book appointments seamlessly, and manage your healthcare journey all in one place.
          </p>
          <div className="hero-actions">
            <Button 
              type="primary" 
              size="large"
              className="hero-btn-primary"
              onClick={() => navigate('/appointments')}
            >
              My Appointments <ArrowRightOutlined />
            </Button>
            <Button 
              size="large"
              className="hero-btn-outline"
              onClick={() => document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Find Doctors
            </Button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{doctors.length}+</span>
              <span className="stat-label">Expert Doctors</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Patients</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Specializations</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <div className="hero-card-icon">
              <CalendarOutlined />
            </div>
            <div className="hero-card-text">
              <span>Book Appointment</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="hero-card-icon green">
              <TeamOutlined />
            </div>
            <div className="hero-card-text">
              <span>Expert Care</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          <div className="hero-card hero-card-3">
            <div className="hero-card-icon blue">
              <MedicineBoxOutlined />
            </div>
            <div className="hero-card-text">
              <span>Quality Service</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2>Why Choose VisionCare</h2>
          <p>Experience healthcare management like never before</p>
        </div>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="feature-card" bordered={false}>
                <div 
                  className="feature-icon" 
                  style={{ background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Doctors Section */}
      <div className="doctors-section" id="doctors-section">
        <div className="section-header">
          <h2>Our Expert Doctors</h2>
          <p>Find the right specialist for your healthcare needs</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Loading doctors...</span>
          </div>
        ) : doctors.length === 0 ? (
          <Empty 
            description="No doctors available at the moment"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {doctors.map((doctor, index) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={doctor._id || index}>
                <DoctorList doctor={doctor} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Add styles inline for the homepage */}
      <style>{`
        .hero-section {
          display: flex;
          gap: 60px;
          align-items: center;
          padding: 40px 0 60px;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #fff8f3 0%, #f0f7f7 100%);
          border-radius: 24px;
        }
        
        .hero-content {
          flex: 1;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #5c5c5c;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #2a9d8f;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .hero-title {
          font-size: 2.8rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 20px;
          color: #1a1a2e;
        }
        
        .hero-title .highlight {
          background: linear-gradient(135deg, #ff6b35 0%, #f4a261 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          line-height: 1.7;
          margin: 0 0 32px;
          max-width: 500px;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
        }
        
        .hero-btn-primary {
          padding: 14px 28px;
          height: auto;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
          border: none;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.35);
        }
        
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.45);
        }
        
        .hero-btn-outline {
          padding: 14px 28px;
          height: auto;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          border: 2px solid #ff6b35;
          color: #ff6b35;
        }
        
        .hero-btn-outline:hover {
          background: #ff6b35;
          color: white;
        }
        
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a2e;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e9ecef;
        }
        
        .hero-visual {
          position: relative;
          width: 400px;
          height: 350px;
          flex-shrink: 0;
        }
        
        .hero-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          animation: float 6s ease-in-out infinite;
        }
        
        .hero-card-1 {
          top: 20px;
          right: 0;
          animation-delay: 0s;
        }
        
        .hero-card-2 {
          top: 120px;
          left: 0;
          animation-delay: 2s;
        }
        
        .hero-card-3 {
          bottom: 20px;
          right: 40px;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .hero-card-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6b35 0%, #f4a261 100%);
          border-radius: 12px;
          color: white;
          font-size: 1.2rem;
        }
        
        .hero-card-icon.green {
          background: linear-gradient(135deg, #2a9d8f 0%, #3db8a9 100%);
        }
        
        .hero-card-icon.blue {
          background: linear-gradient(135deg, #457b9d 0%, #6a9ab8 100%);
        }
        
        .hero-card-text {
          display: flex;
          flex-direction: column;
        }
        
        .hero-card-text span {
          font-weight: 600;
          color: #1a1a2e;
          font-size: 0.95rem;
        }
        
        .hero-card-text i {
          color: #adb5bd;
          font-size: 0.8rem;
        }
        
        /* Features Section */
        .features-section {
          margin-bottom: 50px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .section-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 12px;
        }
        
        .section-header p {
          font-size: 1.05rem;
          color: #6c757d;
          margin: 0;
        }
        
        .feature-card {
          height: 100%;
          text-align: center;
          padding: 28px 20px;
          border-radius: 20px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border-radius: 16px;
          font-size: 1.6rem;
        }
        
        .feature-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0 0 10px;
        }
        
        .feature-description {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
          line-height: 1.6;
        }
        
        /* Doctors Section */
        .doctors-section {
          padding-top: 20px;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #6c757d;
        }
        
        .loading-container i {
          font-size: 2rem;
          color: #ff6b35;
          margin-bottom: 12px;
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
          }
          
          .hero-visual {
            display: none;
          }
          
          .hero-subtitle {
            max-width: 100%;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .hero-stats {
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-actions {
            flex-direction: column;
          }
          
          .hero-stats {
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .stat-divider {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;
