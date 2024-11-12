import React, { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";

import { toast } from "react-toastify";
import api from "../../../config/axiox";

function ManageComplaint() {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get("/complaints/getAll");
      setDatas(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch data");
    }
  };

  const fetchComplaintsByStaff = async () => {
    try {
      const response = await api.get("/complaints/getAllByStaff");
      setDatas(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch data for staff");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      if (values.complaintId) {
        // Update the complaint using the new endpoint
        response = await api.put(
          `/complaints/updateByUser/${values.complaintId}`,
          values
        );
      } else {
        // Create a new complaint
        response = await api.post("/complaints/add", values);
      }
      toast.success("Successfully saved");
      fetchData(); // Reload data
      form.resetFields();
      setShowModal(false); // Close modal
    } catch (error) {
      toast.error(error?.response?.data || "Failed to save complaint");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Failed to delete complaint: Invalid ID");
      return;
    }

    try {
      await api.delete(`/complaints/delete/${id}`);
      toast.success("Complaint deleted successfully");
      fetchData(); // Reload data after deletion to reflect changes
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete complaint";
      toast.error(errorMessage);
    }
  };

  const handleSearchByDescription = async (description) => {
    try {
      const response = await api.get(`/complaints/search/description`, {
        params: { description },
      });
      setDatas(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to search by description");
    }
  };

  const handleSearchByStatus = async (status) => {
    try {
      const response = await api.get(`/complaints/searchByStatus`, {
        params: { status },
      });
      setDatas(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to search by status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "complaintId", key: "id" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Date",
      dataIndex: "submittedDate",
      key: "date",
      render: (submittedDate) => {
        const date = new Date(submittedDate);
        return date.toLocaleDateString("vi-VN");
      },
    },
    { title: "Ride_Id", dataIndex: "rideId", key: "rideId" },
    { title: "User_Id", dataIndex: "userId", key: "userId" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <div>
            <Popconfirm
              title="Delete"
              description="Do you want to delete this complaint?"
              onConfirm={() => handleDelete(record.complaintId)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Input.Search
          placeholder="Search by Description"
          onSearch={handleSearchByDescription}
          style={{ width: 300, marginRight: 10 }}
        />
        <Input.Search
          placeholder="Search by Status"
          onSearch={handleSearchByStatus}
          style={{ width: 300 }}
        />
      </div>
      <Table dataSource={datas} columns={columns} rowKey="complaintId" />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title="Complaint"
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="complaintId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description" }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageComplaint;
