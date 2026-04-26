import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  // =========== doctor menu ===============
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
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
  // =========== doctor menu ===============

  // rendering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
                {getUserInitials(user?.name)}
              </Avatar>
              <span className="user-name-mini">{user?.name?.split(' ')[0]}</span>
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
                onClick={() => navigate("/profile")}
              >
                <Avatar 
                  size={36}
                  style={{ 
                    backgroundColor: user?.isDoctor ? '#2a9d8f' : '#ff6b35',
                    fontWeight: 600
                  }}
                >
                  {getUserInitials(user?.name)}
                </Avatar>
                <span className="user-name">{user?.name}</span>
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
