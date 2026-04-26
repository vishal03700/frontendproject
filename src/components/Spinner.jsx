import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
        <div className="spinner-center">
          <i className="fa-solid fa-heart-pulse"></i>
        </div>
      </div>
      <p className="spinner-text">Loading...</p>
    </div>
  );
};

export default Spinner;
