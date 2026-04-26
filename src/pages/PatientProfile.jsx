import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Avatar, 
  Upload, 
  message,
  Row, 
  Col
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  CameraOutlined,
  SaveOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { uploadEndpoints, userApi } from "../api/client";
import { getInitials } from "../utils/formatters";

const PatientProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
      setProfileImage(user.profilePicture);
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    dispatch(showLoading());
    setLoading(true);

    try {
      const response = await userApi.updateProfile({
          userId: user._id,
          ...values,
          profilePicture: profileImage,
        });

      if (response.success) {
        message.success("Profile updated successfully!");
        dispatch(setUser({ ...user, ...values, profilePicture: profileImage }));
        setIsEditing(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Failed to update profile");
    } finally {
      dispatch(hideLoading());
      setLoading(false);
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setProfileImage(info.file.response?.url || info.file.name);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed`);
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="page-header">
          <h2><UserOutlined /> My Profile</h2>
          <p>Manage your personal information and account settings</p>
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
                    backgroundColor: '#ff6b35',
                    fontSize: '2.5rem',
                    fontWeight: 600
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
                {isEditing && (
                  <Upload
                    showUploadList={false}
                    action={uploadEndpoints.userProfile}
                    headers={{ Authorization: `Bearer ${localStorage.getItem("token")}` }}
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
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <span className="user-role">
                  {user?.isDoctor ? "Doctor" : user?.isAdmin ? "Admin" : "Patient"}
                </span>
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

          {/* Personal Details Form */}
          <Card className="profile-form-card" bordered={false}>
            <h3>Personal Information</h3>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              disabled={!isEditing}
              className="profile-form"
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter your full name"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Enter your email"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Enter your phone number"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Address"
                    name="address"
                  >
                    <Input 
                      prefix={<HomeOutlined />} 
                      placeholder="Enter your address"
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
          </Card>

          {/* Account Info */}
          <Card className="account-info-card" bordered={false}>
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value">#{user?._id?.slice(-8)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Type</span>
                <span className="info-value">
                  {user?.isAdmin ? "Administrator" : user?.isDoctor ? "Doctor" : "Patient"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value status-active">Active</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Verified</span>
                <span className="info-value">{user?.email ? "Yes" : "No"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .profile-page {
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
          color: #ff6b35;
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
          margin: 0 0 8px;
          color: #6c757d;
        }
        
        .user-role {
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
        
        .profile-form .ant-input {
          border-radius: 10px;
        }
        
        .form-actions {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }
        
        .save-btn {
          background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%) !important;
          border: none !important;
          height: auto !important;
          padding: 12px 32px !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
        }
        
        /* Account Info Card */
        .account-info-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        
        .account-info-card h3 {
          font-size: 1.2rem;
          color: #1a1a2e;
          margin: 0 0 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .info-label {
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        .info-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a2e;
        }
        
        .status-active {
          color: #2a9d8f;
        }
        
        @media (max-width: 768px) {
          .photo-section {
            flex-direction: column;
            text-align: center;
          }
          
          .edit-btn {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default PatientProfile;
