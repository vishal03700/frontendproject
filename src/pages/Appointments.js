import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table, Tag, Card, Empty } from "antd";
import { 
  CalendarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        // Sort newest first by createdAt, falling back to date field
        const sorted = res.data.data.sort((a, b) => {
          const dateA = moment(a.createdAt || a.date, a.createdAt ? undefined : "DD-MM-YYYY");
          const dateB = moment(b.createdAt || b.date, b.createdAt ? undefined : "DD-MM-YYYY");
          return dateB.valueOf() - dateA.valueOf();
        });
        setAppointments(sorted);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const getStatusTag = (status) => {
    const statusConfig = {
      approved: { color: "#2a9d8f", icon: <CheckCircleOutlined />, text: "Approved" },
      rejected: { color: "#e63946", icon: <CloseCircleOutlined />, text: "Rejected" },
      pending: { color: "#f4a261", icon: <SyncOutlined spin />, text: "Pending" },
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    
    return (
      <Tag 
        color={config.color} 
        icon={config.icon}
        style={{ 
          padding: "4px 12px", 
          borderRadius: "20px",
          fontWeight: 500,
          border: "none"
        }}
      >
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
      render: (id) => (
        <span style={{ fontFamily: "monospace", color: "#6c757d" }}>
          #{id?.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctorInfo",
      render: (info) => (
        <div className="doctor-cell">
          <div className="doctor-avatar-mini">
            {info?.firstName?.[0]}{info?.lastName?.[0]}
          </div>
          <span>Dr. {info?.firstName} {info?.lastName}</span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const dateA = moment(a.date, "DD-MM-YYYY");
        const dateB = moment(b.date, "DD-MM-YYYY");
        return dateA.valueOf() - dateB.valueOf();
      },
      render: (text, record) => {
        // Handle both ISO format (old corrupted data) and plain string format (new correct data)
        let displayDate = text;
        let displayTime = record.time;
        
        // If date is ISO string, convert it
        if (text && text.includes("T")) {
          displayDate = moment(text).format("DD MMM YYYY");
        } else if (text) {
          displayDate = moment(text, "DD-MM-YYYY").format("DD MMM YYYY");
        }
        
        // If time is ISO string or invalid, handle gracefully
        if (record.time && record.time.includes("T")) {
          displayTime = moment(record.time).format("hh:mm A");
        } else if (record.time && record.time.includes(":")) {
          // Plain HH:mm format
          displayTime = moment(record.time, "HH:mm").format("hh:mm A");
        }
        
        return (
          <div className="datetime-cell">
            <CalendarOutlined style={{ color: "#ff6b35", marginRight: 8 }} />
            {displayDate}
            <br />
            <ClockCircleOutlined style={{ color: "#2a9d8f", marginRight: 8, marginTop: 4 }} />
            {displayTime || "Not set"}
          </div>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <Layout>
      <div className="appointments-page">
        <div className="page-header">
          <h2><CalendarOutlined /> My Appointments</h2>
          <p>View and manage your appointment history</p>
        </div>
        
        <Card className="appointments-card" bordered={false}>
          {loading ? (
            <div className="loading-state">
              <SyncOutlined spin style={{ fontSize: 24, color: "#ff6b35" }} />
              <span>Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <Empty 
              description="No appointments yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <p style={{ color: "#6c757d" }}>Book your first appointment with a doctor</p>
            </Empty>
          ) : (
            <Table 
              columns={columns} 
              dataSource={appointments} 
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              className="appointments-table"
            />
          )}
        </Card>
      </div>

      <style>{`
        .appointments-page {
          animation: fadeIn 0.5s ease;
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
        
        .appointments-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #6c757d;
          gap: 12px;
        }
        
        .doctor-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .doctor-avatar-mini {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #ff6b35 0%, #f4a261 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.8rem;
        }
        
        .datetime-cell {
          line-height: 1.8;
        }
        
        .appointments-table .ant-table-thead > tr > th {
          background: #f8f9fa;
          font-weight: 600;
          color: #1a1a2e;
        }
        
        .appointments-table .ant-table-tbody > tr:hover > td {
          background: #fff8f3;
        }
      `}</style>
    </Layout>
  );
};

export default Appointments;