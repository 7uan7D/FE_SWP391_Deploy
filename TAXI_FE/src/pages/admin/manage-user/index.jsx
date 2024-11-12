import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/file";
import api from "../../../config/axiox";
import { Option } from "antd/es/mentions";

function ManageUser() {
  const [datas, setDatas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get("/user/getAllUsers");
      const usersWithKey = response.data.map((user) => ({
        ...user,
        key: user.userId,
      }));
      setDatas(usersWithKey);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      dataIndex: "userId",
      key: "id",
      render: (id) => {
        return (
          <>
            <Popconfirm
              title="Delete"
              description="Do you want delete this user"
              onConfirm={() => handleDeleteUser(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitUser = async (user) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const url = await uploadFile(file.originFileObj);
      user.image = url;
    }

    try {
      setLoading(true);
      if (user.userId) {
        await api.put(`/user/updateUser/${user.userId}`, user);
      } else {
        await api.post("/user/registerNewUser", user);
      }
      toast.success("Successfully saved");
      fetchData();
      form.resetFields();
      setOpenModal(false);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      toast.error("Failed to delete user: Invalid ID");
      return;
    }
    try {
      await api.delete(`/user/deleteUser/${userId}`);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

 

  return (
    <div>
      <Button onClick={handleOpenModal}>Create new user</Button>
      <Table columns={columns} dataSource={datas} />
      <Modal
        confirmLoading={submitting}
        onOk={() => form.submit()}
        title="Create new user"
        open={openModal}
        onCancel={handleCloseModal}
      >
        <Form onFinish={handleSubmitUser} form={form}>
          <Form.Item
            label="User's name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input User's name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input user's email",
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="User's Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input user's password",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default ManageUser;
