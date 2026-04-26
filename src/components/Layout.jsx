import React from "react";
import "./Layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { clearSession } from "../utils/auth";
import { getInitials } from "../utils/formatters";
import { adminMenu, userMenu } from "../utils/navigation";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    message.success("Logged out successfully");
    navigate("/login");
  };

  const doctorMenu = [
    {
      name: "Home",
      path: "/home",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-calendar-check",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user-doctor",
    },
  ];

  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const profilePath = user?.isDoctor ? `/doctor/profile/${user?._id}` : "/profile";
  const userName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const firstName = userName.split(" ")[0] || "User";

  return (
    <div className="main">
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-icon">
                <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <h6 className="logo-text">VisionCare</h6>
            </div>
            <hr className="sidebar-divider" />
          </div>
          
          <div className="menu">
            {SidebarMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div 
                  key={index}
                  className={`menu-item ${isActive ? "active" : ""}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            
            <div className="menu-item logout-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
          
          <div className="sidebar-footer">
            <div className="user-info-mini">
              <Avatar 
                style={{ 
                  backgroundColor: user?.isDoctor ? '#2a9d8f' : '#ff6b35',
                  fontWeight: 600
                }}
              >
                {getInitials(userName)}
              </Avatar>
              <span className="user-name-mini">{firstName}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content">
          <div className="header">
            <div className="header-left">
              <h4 className="page-title">
                {SidebarMenu.find(m => m.path === location.pathname)?.name || 'Dashboard'}
              </h4>
            </div>
            
            <div className="header-right">
              <Badge 
                count={user?.notifcation?.length || 0} 
                size="small"
                className="notification-badge"
              >
                <div 
                  className="header-icon-btn"
                  onClick={() => navigate("/notification")}
                >
                  <BellOutlined />
                </div>
              </Badge>

              <div 
                className="user-profile-btn"
                onClick={() => navigate(profilePath)}
              >
                <Avatar 
                  size={36}
                  style={{ 
                    backgroundColor: user?.isDoctor ? '#2a9d8f' : '#ff6b35',
                    fontWeight: 600
                  }}
                >
                  {getInitials(userName)}
                </Avatar>
                <span className="user-name">{userName}</span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>
          
          <div className="body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
