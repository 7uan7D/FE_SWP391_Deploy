import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../config/axiox";
import { toast } from "react-toastify";

function ManageLocation() {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch location data
  const fetchData = async () => {
    try {
      const response = await api.get("locations/getAll");
      setDatas(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch data");
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      if (values.locationId) {
        response = await api.put(
          `locations/update/${values.locationId}`,
          values
        ); 
      } else {
        response = await api.post("locations/add", values);
      }

      toast.success("Successfully saved");
      fetchData(); 
      form.resetFields();
      setShowModal(false); // Close modal
    } catch (error) {
      toast.error(error?.response?.data || "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Failed to delete location: Invalid ID");
      return;
    }

    try {
      await api.delete(`/locations/delete/${id}`); 
      toast.success("Location deleted successfully");
      fetchData(); 
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete location";
      toast.error(errorMessage);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, []);

  
  const columns = [
    {
      title: "ID",
      dataIndex: "locationId", 
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "locationName", 
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '10px'}}>
          <div>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(record); 
            }}
          >
            Edit
          </Button>
          </div>
          <div>
          <Popconfirm
            title="Delete"
            description="Do you want to delete this location?"
            onConfirm={() => handleDelete(record.locationId)} 
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
      <Button onClick={() => setShowModal(true)}>Add</Button>
      <Table dataSource={datas} columns={columns} rowKey="locationId" />{" "}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title="Location"
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item name="locationId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="locationName" 
            label="Name"
            rules={[
              { required: true, message: "Please input the location's name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageLocation;
