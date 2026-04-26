import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import moment from "moment";
import { message, Table, Tag, Card, Empty } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { doctorApi } from "../../api/client";
import {
  formatAppointmentDate,
  formatAppointmentTime,
  sortAppointmentsByLatest,
} from "../../utils/formatters";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      setLoading(true);
      const response = await doctorApi.getAppointments();

      if (response.success) {
        setAppointments(sortAppointmentsByLatest(response.data));
      }
    } catch (error) {
      message.error(error.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const response = await doctorApi.updateAppointmentStatus(record._id, status);

      if (response.success) {
        message.success(response.message);
        getAppointments();
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      approved: { color: "#2a9d8f", icon: <CheckCircleOutlined />, text: "Approved" },
      rejected: { color: "#e63946", icon: <CloseCircleOutlined />, text: "Rejected" },
      pending:  { color: "#f4a261", icon: <SyncOutlined spin />,   text: "Pending"  },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
      <Tag
        color={config.color}
        icon={config.icon}
        style={{ padding: "4px 12px", borderRadius: "20px", fontWeight: 500, border: "none" }}
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
      title: "Patient",
      dataIndex: "userInfo",
      render: (info) => (
        <div className="patient-cell">
          <div className="patient-avatar-mini">
            <UserOutlined />
          </div>
          <span>{info?.name || "Unknown Patient"}</span>
        </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        moment(a.date, "DD-MM-YYYY").valueOf() - moment(b.date, "DD-MM-YYYY").valueOf(),
      render: (text, record) => {
        return (
          <div className="datetime-cell">
            <CalendarOutlined style={{ color: "#ff6b35", marginRight: 8 }} />
            {formatAppointmentDate(text)}
            <br />
            <ClockCircleOutlined style={{ color: "#2a9d8f", marginRight: 8, marginTop: 4 }} />
            {formatAppointmentTime(record.time)}
          </div>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="action-btns">
          {record.status === "pending" ? (
            <>
              <button
                className="action-btn approve-btn"
                onClick={() => handleStatus(record, "approved")}
              >
                <CheckCircleOutlined /> Approve
              </button>
              <button
                className="action-btn reject-btn"
                onClick={() => handleStatus(record, "rejected")}
              >
                <CloseCircleOutlined /> Reject
              </button>
            </>
          ) : (
            <span style={{ color: "#adb5bd", fontSize: "0.85rem" }}>No actions</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="appointments-page">
        <div className="page-header">
          <h2><CalendarOutlined /> Appointment Requests</h2>
          <p>Review and manage patient appointment bookings</p>
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
              <p style={{ color: "#6c757d" }}>Patient bookings will appear here</p>
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

        .patient-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .patient-avatar-mini {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #2a9d8f 0%, #1f7a6f 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
        }

        .datetime-cell {
          line-height: 1.8;
        }

        .action-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .action-btn:hover {
          opacity: 0.85;
        }

        .approve-btn {
          background: linear-gradient(135deg, #2a9d8f 0%, #1f7a6f 100%);
          color: white;
        }

        .reject-btn {
          background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
          color: white;
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

export default DoctorAppointments;
