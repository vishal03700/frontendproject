import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { 
  MedicineBoxOutlined, 
  ClockCircleOutlined, 
  DollarOutlined,
  UserOutlined
} from "@ant-design/icons";
import "./DoctorList.css";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="doctor-card"
      hoverable
      onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
    >
      <div className="doctor-card-header">
        <div className="doctor-avatar">
          <span className="avatar-text">
            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
          </span>
        </div>
        <div className="doctor-info">
          <h3 className="doctor-name">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <span className="doctor-specialization">
            {doctor.specialization}
          </span>
        </div>
      </div>
      
      <div className="doctor-card-body">
        <div className="doctor-detail">
          <MedicineBoxOutlined className="detail-icon" />
          <span className="detail-label">Specialization</span>
          <span className="detail-value">{doctor.specialization}</span>
        </div>
        
        <div className="doctor-detail">
          <UserOutlined className="detail-icon" />
          <span className="detail-label">Experience</span>
          <span className="detail-value">{doctor.experience} years</span>
        </div>
        
        <div className="doctor-detail">
          <DollarOutlined className="detail-icon" />
          <span className="detail-label">Consultation Fee</span>
          <span className="detail-value">₹{doctor.feesPerCunsaltation}</span>
        </div>
        
        <div className="doctor-detail">
          <ClockCircleOutlined className="detail-icon" />
          <span className="detail-label">Availability</span>
          <span className="detail-value">
            {doctor.timings?.[0]} - {doctor.timings?.[1]}
          </span>
        </div>
      </div>
      
      <div className="doctor-card-footer">
        <button className="book-btn">
          Book Appointment <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </Card>
  );
};

export default DoctorList;
