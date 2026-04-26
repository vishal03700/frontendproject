import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import { message, Table } from "antd";
import { adminApi } from "../../api/client";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const response = await adminApi.getDoctors();

      if (response.success) {
        setDoctors(response.data);
      }
    } catch (error) {
      message.error(error.message || "Failed to load doctors");
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const response = await adminApi.changeDoctorAccountStatus(record._id, status);

      if (response.success) {
        message.success(response.message);
        getDoctors();
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button className="btn btn-danger">Reject</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">All Doctors</h1>
      <Table columns={columns} dataSource={doctors} rowKey="_id" />
    </Layout>
  );
};

export default Doctors;
