import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Col, Form, Input, Row, TimePicker, message, 
  Card, Avatar, Button, Upload, Divider
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  GlobalOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CameraOutlined,
  SaveOutlined,
  EditOutlined,
  StarOutlined
} from "@ant-design/icons";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "D";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Get doctor info
  const getDoctorInfo = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
        setProfileImage(res.data.data?.profilePicture);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to load doctor profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, [params.id]);

  // Handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...values,
          profilePicture: profileImage,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Profile updated successfully!");
        setIsEditing(false);
        getDoctorInfo();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Failed to update profile");
    }
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setProfileImage(info.file.response?.url || info.file.name);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed`);
    }
  };

  return (
    <Layout>
      <div className="doctor-profile-page">
        <div className="page-header">
          <h2><MedicineBoxOutlined /> Doctor Profile</h2>
          <p>Manage your professional information and availability</p>
        </div>

        <div className="profile-container">
          {/* Profile Photo Section */}
          <Card className="profile-photo-card" bordered={false}>
            <div className="photo-section">
              <div className="avatar-container">
                <Avatar 
                  size={120} 
                  src={profileImage}
                  style={{ 
                    backgroundColor: '#2a9d8f',
                    fontSize: '2.5rem',
                    fontWeight: 600
                  }}
                >
                  {getUserInitials(doctor?.firstName)}
                </Avatar>
                {isEditing && (
                  <Upload
                    showUploadList={false}
                    action="/api/v1/user/upload-profile"
                    headers={{
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }}
                    onChange={handleImageUpload}
                  >
                    <div className="avatar-overlay">
                      <CameraOutlined />
                      <span>Change Photo</span>
                    </div>
                  </Upload>
                )}
              </div>
              <div className="user-info">
                <h3>Dr. {doctor?.firstName} {doctor?.lastName}</h3>
                <p>{doctor?.email}</p>
                <div className="doctor-tags">
                  <span className="doctor-role">
                    <StarOutlined /> {doctor?.specialization}
                  </span>
                  <span className="experience-badge">
                    {doctor?.experience} Experience
                  </span>
                </div>
              </div>
              <Button 
                type={isEditing ? "default" : "primary"}
                icon={<EditOutlined />}
                onClick={() => setIsEditing(!isEditing)}
                className="edit-btn"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </Card>

          {/* Professional Details Form */}
          <Card className="profile-form-card" bordered={false}>
            <h3>Professional Information</h3>
            
            {doctor && (
              <Form
                layout="vertical"
                onFinish={handleFinish}
                disabled={!isEditing}
                className="profile-form"
                initialValues={{
                  ...doctor,
                  timings: [
                    moment(doctor.timings[0], "HH:mm"),
                    moment(doctor.timings[1], "HH:mm"),
                  ],
                }}
              >
                <Row gutter={[24, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      rules={[{ required: true, message: "Please enter first name" }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="First name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      rules={[{ required: true, message: "Please enter last name" }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Last name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Please enter a valid email" }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Email address"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[{ required: true, message: "Please enter phone" }]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="Phone number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Website"
                      name="website"
                    >
                      <Input 
                        prefix={<GlobalOutlined />} 
                        placeholder="Website URL"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Address"
                      name="address"
                      rules={[{ required: true, message: "Please enter address" }]}
                    >
                      <Input 
                        prefix={<HomeOutlined />} 
                        placeholder="Clinic address"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Professional Details</Divider>

                <Row gutter={[24, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Specialization"
                      name="specialization"
                      rules={[{ required: true, message: "Please enter specialization" }]}
                    >
                      <Input 
                        prefix={<MedicineBoxOutlined />} 
                        placeholder="Specialization"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Experience"
                      name="experience"
                      rules={[{ required: true, message: "Please enter experience" }]}
                    >
                      <Input 
                        prefix={<ClockCircleOutlined />} 
                        placeholder="Years of experience"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Consultation Fees"
                      name="feesPerCunsaltation"
                      rules={[{ required: true, message: "Please enter fees" }]}
                    >
                      <Input 
                        prefix={<DollarOutlined />} 
                        placeholder="Fees per consultation"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Working Hours"
                      name="timings"
                      rules={[{ required: true, message: "Please select timings" }]}
                    >
                      <TimePicker.RangePicker 
                        format="HH:mm" 
                        style={{ width: '100%' }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {isEditing && (
                  <div className="form-actions">
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                      className="save-btn"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </Form>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="stats-card" bordered={false}>
            <h3>Quick Overview</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Consultation Fee</span>
                <span className="stat-value">₹{doctor?.feesPerCunsaltation || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Specialization</span>
                <span className="stat-value">{doctor?.specialization || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Experience</span>
                <span className="stat-value">{doctor?.experience || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Working Hours</span>
                <span className="stat-value">
                  {doctor?.timings?.[0]} - {doctor?.timings?.[1]}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .doctor-profile-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 24px;
        }
        
        .page-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .page-header h2 i {
          color: #2a9d8f;
        }
        
        .page-header p {
          color: #6c757d;
          margin: 0;
        }
        
        .profile-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        /* Photo Card */
        .profile-photo-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        
        .photo-section {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .avatar-container {
          position: relative;
        }
        
        .avatar-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px;
          border-radius: 0 0 60px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }
        
        .user-info {
          flex: 1;
        }
        
        .user-info h3 {
          margin: 0 0 4px;
          font-size: 1.5rem;
          color: #1a1a2e;
        }
        
        .user-info p {
          margin: 0 0 12px;
          color: #6c757d;
        }
        
        .doctor-tags {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .doctor-role {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(42, 157, 143, 0.1);
          color: #2a9d8f;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .experience-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .edit-btn {
          border-radius: 10px !important;
        }
        
        /* Form Card */
        .profile-form-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        
        .profile-form-card h3 {
          font-size: 1.2rem;
          color: #1a1a2e;
          margin: 0 0 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .profile-form .ant-form-item-label > label {
          font-weight: 500;
          color: #444;
        }
        
        .profile-form .ant-input, .profile-form .ant-picker {
          border-radius: 10px;
        }
        
        .form-actions {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }
        
        .save-btn {
          background: linear-gradient(135deg, #2a9d8f 0%, #1f7a6f 100%) !important;
          border: none !important;
          height: auto !important;
          padding: 12px 32px !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
        }
        
        /* Stats Card */
        .stats-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        
        .stats-card h3 {
          font-size: 1.2rem;
          color: #1a1a2e;
          margin: 0 0 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a2e;
        }
        
        @media (max-width: 768px) {
          .photo-section {
            flex-direction: column;
            text-align: center;
          }
          
          .edit-btn {
            width: 100%;
          }
          
          .doctor-tags {
            justify-content: center;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Profile;
