import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker, message, TimePicker, Card, Button, Result, Spin, Empty, Avatar } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { doctorApi, userApi } from "../api/client";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      setLoading(true);
      const response = await doctorApi.getDoctorById(params.doctorId);

      if (response.success) {
        setDoctor(response.data);
      } else {
        message.error("Doctor not found");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
      message.error("Failed to load doctor information");
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!date || !time) {
      message.warning("Please select both date and time");
      return;
    }
    try {
      setBookingLoading(true);
      dispatch(showLoading());
      const response = await userApi.bookAppointment({
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date,
          time,
        });

      if (response.success) {
        setBookingSuccess(true);
        message.success("Appointment request sent!");
      } else {
        message.error(response.message || "Failed to book appointment");
      }
    } catch (error) {
      message.error(error.message || "Unable to book appointment. Please try again.");
    } finally {
      dispatch(hideLoading());
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    if (params.doctorId) {
      getDoctorData();
    }
    // eslint-disable-next-line
  }, [params.doctorId]);

  if (loading) {
    return (
      <Layout>
        <div className="booking-loading">
          <Spin size="large" />
          <p>Loading doctor information...</p>
        </div>
        <style>{`
          .booking-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
            color: #6c757d;
          }
        `}</style>
      </Layout>
    );
  }

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="booking-success">
          <Result
            status="success"
            title="Appointment Request Sent!"
            subTitle="Your request has been submitted. The doctor will approve or reject it shortly. You can track the status in My Appointments."
            extra={[
              <Button
                type="primary"
                key="view"
                onClick={() => navigate("/appointments")}
                style={{ background: "#ff6b35", borderColor: "#ff6b35" }}
              >
                View My Appointments
              </Button>,
              <Button key="home" onClick={() => navigate("/home")}>
                Go to Dashboard
              </Button>,
            ]}
          />
        </div>
        <style>{`
          .booking-success {
            padding: 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          }
        `}</style>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="booking-error">
          <Empty
            description="Doctor not found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button type="primary" onClick={() => navigate("/home")}>
            Back to Home
          </Button>
        </div>
        <style>{`
          .booking-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 20px;
          }
        `}</style>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="booking-page">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/home")}
          className="back-btn"
        >
          Back to Doctors
        </Button>

        <div className="booking-container">
          {/* Doctor Info Card */}
          <Card className="doctor-info-card" bordered={false}>
            <div className="doctor-header">
              <Avatar
                size={80}
                style={{ backgroundColor: "#ff6b35", fontSize: "2rem", fontWeight: 600 }}
              >
                {doctor?.firstName?.[0]}{doctor?.lastName?.[0]}
              </Avatar>
              <div className="doctor-details">
                <h2>Dr. {doctor?.firstName} {doctor?.lastName}</h2>
                <span className="specialization-tag">
                  <MedicineBoxOutlined /> {doctor?.specialization}
                </span>
              </div>
            </div>

            <div className="doctor-meta">
              <div className="meta-item">
                <div className="meta-icon"><DollarOutlined /></div>
                <div>
                  <span className="meta-label">Consultation Fee</span>
                  <span className="meta-value">₹{doctor?.feesPerCunsaltation}</span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-icon"><ClockCircleOutlined /></div>
                <div>
                  <span className="meta-label">Availability</span>
                  <span className="meta-value">
                    {doctor?.timings?.[0]} - {doctor?.timings?.[1]}
                  </span>
                </div>
              </div>
              <div className="meta-item">
                <div className="meta-icon"><UserOutlined /></div>
                <div>
                  <span className="meta-label">Experience</span>
                  <span className="meta-value">{doctor?.experience} years</span>
                </div>
              </div>
              {doctor?.address && (
                <div className="meta-item">
                  <div className="meta-icon"><EnvironmentOutlined /></div>
                  <div>
                    <span className="meta-label">Clinic Address</span>
                    <span className="meta-value">{doctor?.address}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Booking Form Card */}
          <Card className="booking-form-card" bordered={false}>
            <h3><CalendarOutlined /> Book Appointment</h3>

            <div className="notice-banner">
              <SyncOutlined style={{ color: "#f4a261", marginTop: 2 }} />
              <span>
                After booking, the doctor will <strong>approve or reject</strong> your
                request. You'll be notified on the notifications page.
              </span>
            </div>

            <div className="form-section">
              <label>Select Date</label>
              <DatePicker
                className="date-picker"
                format="DD MMMM YYYY"
                placeholder="Choose a date"
                disabledDate={(current) => current && current < moment().startOf("day")}
                onChange={(value) => setDate(value ? moment(value).format("DD-MM-YYYY") : "")}
                size="large"
              />
            </div>

            <div className="form-section">
              <label>Select Time</label>
              <TimePicker
                className="time-picker"
                format="hh:mm A"
                placeholder="Choose a time"
                use12Hours
                minuteStep={30}
                onChange={(value) => setTime(value ? moment(value).format("HH:mm") : null)}
                size="large"
              />
            </div>

            <Button
              type="primary"
              size="large"
              className="book-btn"
              onClick={handleBooking}
              disabled={!date || !time}
              loading={bookingLoading}
              block
            >
              <CalendarOutlined /> Request Appointment
            </Button>
          </Card>
        </div>
      </div>

      <style>{`
        .booking-page {
          max-width: 1000px;
          margin: 0 auto;
        }

        .back-btn {
          margin-bottom: 20px;
          color: #6c757d;
        }

        .back-btn:hover {
          color: #ff6b35;
        }

        .booking-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .booking-container {
            grid-template-columns: 1fr;
          }
        }

        .doctor-info-card,
        .booking-form-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .doctor-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 20px;
        }

        .doctor-details h2 {
          margin: 0 0 8px;
          font-size: 1.4rem;
          color: #1a1a2e;
        }

        .specialization-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .doctor-meta {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .meta-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 10px;
          color: #ff6b35;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .meta-label {
          display: block;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .meta-value {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .booking-form-card h3 {
          font-size: 1.3rem;
          color: #1a1a2e;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .notice-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(244, 162, 97, 0.12);
          border-left: 3px solid #f4a261;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 24px;
          font-size: 0.88rem;
          color: #555;
          line-height: 1.5;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .form-section label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #444;
          margin-bottom: 10px;
        }

        .date-picker,
        .time-picker {
          width: 100%;
        }

        .book-btn {
          background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
          border: none;
          height: auto;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          margin-top: 8px;
        }

        .book-btn:disabled {
          background: #e9ecef !important;
          color: #adb5bd !important;
        }
      `}</style>
    </Layout>
  );
};

export default BookingPage;
