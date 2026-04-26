import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout";
import { message, Tabs, Card, Button, Empty, Badge } from "antd";
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  DeleteOutlined, 
  ClockCircleOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  CheckOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/client";
import { formatNotificationTime } from "../utils/formatters";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("unread");
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await userApi.getNotifications();

      if (response.success) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      message.error(error.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  const handleMarkAllRead = async () => {
    dispatch(showLoading());

    try {
      const response = await userApi.markAllNotificationsRead();

      if (response.success) {
        message.success("All notifications marked as read");
        fetchNotifications();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleDeleteAllRead = async () => {
    dispatch(showLoading());

    try {
      const response = await userApi.deleteAllNotifications();

      if (response.success) {
        message.success("All read notifications deleted");
        fetchNotifications();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  };

  const getNotificationIcon = (msg) => {
    const lower = msg?.toLowerCase() || "";
    if (lower.includes("approved") || lower.includes("accepted")) return <CheckCircleOutlined />;
    if (lower.includes("rejected") || lower.includes("declined")) return <DeleteOutlined />;
    if (lower.includes("appointment") || lower.includes("booked")) return <CalendarOutlined />;
    return <InfoCircleOutlined />;
  };

  const getNotificationColor = (msg) => {
    const lower = msg?.toLowerCase() || "";
    if (lower.includes("approved") || lower.includes("accepted")) return "#2a9d8f";
    if (lower.includes("rejected") || lower.includes("declined")) return "#e63946";
    if (lower.includes("appointment") || lower.includes("booked")) return "#ff6b35";
    return "#457b9d";
  };

  const renderNotification = (notification, isRead) => (
    <Card
      className={`notification-card ${isRead ? "read" : "unread"}`}
      onClick={() => {
        if (notification.onClickPath) navigate(notification.onClickPath);
      }}
    >
      <div className="notification-content">
        <div
          className="notification-icon"
          style={{ backgroundColor: `${getNotificationColor(notification.message)}15` }}
        >
          <span style={{ color: getNotificationColor(notification.message) }}>
            {getNotificationIcon(notification.message)}
          </span>
        </div>
        <div className="notification-text">
          <p className="notification-message">{notification.message}</p>
          <span className="notification-time">
            <ClockCircleOutlined /> {formatNotificationTime(notification)}
          </span>
        </div>
        {!isRead && <Badge status="processing" />}
      </div>
    </Card>
  );

  const unreadNotifications = user?.notifcation || [];
  const readNotifications = user?.seennotification || [];

  const tabItems = [
    {
      key: "unread",
      label: (
        <span className="tab-label">
          <BellOutlined /> Unread
          {unreadNotifications.length > 0 && (
            <Badge count={unreadNotifications.length} size="small" />
          )}
        </span>
      ),
      children: (
        <div className="notifications-list">
          {unreadNotifications.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No unread notifications" />
          ) : (
            <>
              <div className="notifications-header">
                <span>
                  {unreadNotifications.length} unread notification
                  {unreadNotifications.length !== 1 ? "s" : ""}
                </span>
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={handleMarkAllRead}
                  className="mark-all-btn"
                >
                  Mark all as read
                </Button>
              </div>
              {unreadNotifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {renderNotification(notification, false)}
                </div>
              ))}
            </>
          )}
        </div>
      ),
    },
    {
      key: "read",
      label: (
        <span className="tab-label">
          <CheckCircleOutlined /> Read
        </span>
      ),
      children: (
        <div className="notifications-list">
          {readNotifications.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No read notifications" />
          ) : (
            <>
              <div className="notifications-header">
                <span>
                  {readNotifications.length} read notification
                  {readNotifications.length !== 1 ? "s" : ""}
                </span>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteAllRead}
                  className="delete-all-btn"
                >
                  Delete all
                </Button>
              </div>
              {readNotifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {renderNotification(notification, true)}
                </div>
              ))}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="notification-page">
        <div className="page-header">
          <div className="header-title">
            <BellOutlined />
            <h2>Notifications</h2>
          </div>
          <p>Stay updated with your appointments and updates</p>
        </div>

        <Card className="notifications-card" bordered={false}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        </Card>
      </div>

      <style>{`
        .notification-page {
          max-width: 800px;
          margin: 0 auto;
        }
        .page-header { margin-bottom: 24px; }
        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .header-title h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a2e;
        }
        .page-header p { color: #6c757d; margin: 0; }
        .notifications-card {
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }
        .notifications-card .ant-tabs-nav { margin-bottom: 20px; }
        .tab-label { display: flex; align-items: center; gap: 8px; }
        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .notifications-header span { color: #6c757d; font-size: 0.9rem; }
        .mark-all-btn { color: #2a9d8f !important; }
        .mark-all-btn:hover { color: #1f7a6f !important; }
        .delete-all-btn { color: #e63946 !important; }
        .notification-item { margin-bottom: 12px; }
        .notification-card {
          border-radius: 12px !important;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        .notification-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }
        .notification-card.unread {
          background: linear-gradient(135deg, #fff8f3 0%, #f0f7f7 100%);
          border-left: 3px solid #ff6b35 !important;
        }
        .notification-card.read {
          background: #f8f9fa;
          border-left: 3px solid #e9ecef !important;
        }
        .notification-card .ant-card-body { padding: 16px; }
        .notification-content { display: flex; align-items: flex-start; gap: 16px; }
        .notification-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .notification-text { flex: 1; }
        .notification-message {
          margin: 0 0 8px;
          color: #1a1a2e;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .notification-time {
          font-size: 0.8rem;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        @media (max-width: 576px) {
          .notifications-header { flex-direction: column; gap: 12px; align-items: flex-start; }
        }
      `}</style>
    </Layout>
  );
};

export default NotificationPage;
