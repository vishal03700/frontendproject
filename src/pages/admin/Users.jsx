import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import { Table, message } from "antd";
import { adminApi } from "../../api/client";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await adminApi.getUsers();

      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      message.error(error.message || "Failed to load users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // antD table col
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: () => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </Layout>
  );
};

export default Users;
